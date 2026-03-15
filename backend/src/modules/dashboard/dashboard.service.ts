import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CandidateStatus, LegalReviewStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getPipelineSummary(orgId: string) {
    const candidates = await this.prisma.candidate.groupBy({
      by: ['status'],
      where: { organizationId: orgId },
      _count: { _all: true },
    });

    const summary = {
      LEADS: 0,
      SURVEY: 0,
      DOCUMENTS: 0,
      LEGAL: 0,
      PAYMENT: 0,
      ASSIGNED: 0,
      FOLLOW_UP: 0,
    };

    let docsPending = 0;

    candidates.forEach((c) => {
      switch (c.status) {
        case CandidateStatus.LEAD:
        case CandidateStatus.SURVEY_PENDING:
          summary.LEADS += c._count._all;
          break;
        case CandidateStatus.SURVEY_DONE:
          summary.SURVEY += c._count._all;
          break;
        case CandidateStatus.DOCS_PENDING:
          docsPending += c._count._all;
          summary.DOCUMENTS += c._count._all;
          break;
        case CandidateStatus.DOCS_SUBMITTED:
          summary.DOCUMENTS += c._count._all;
          break;
        case CandidateStatus.LEGAL_REVIEW:
        case CandidateStatus.LEGAL_APPROVED:
        case CandidateStatus.LEGAL_REJECTED:
          summary.LEGAL += c._count._all;
          break;
        case CandidateStatus.PAYMENT_PENDING:
        case CandidateStatus.PAYMENT_DONE:
          summary.PAYMENT += c._count._all;
          break;
        case CandidateStatus.ASSIGNED:
        case CandidateStatus.ACTIVE:
          summary.ASSIGNED += c._count._all;
          break;
        case CandidateStatus.CLOSED_SUCCESS:
          summary.FOLLOW_UP += c._count._all;
          break;
      }
    });

    return {
      LEADS: { count: summary.LEADS },
      SURVEY: { count: summary.SURVEY },
      DOCUMENTS: { count: summary.DOCUMENTS, blocker: docsPending > 0 },
      LEGAL: { count: summary.LEGAL },
      PAYMENT: { count: summary.PAYMENT },
      ASSIGNED: { count: summary.ASSIGNED },
      FOLLOW_UP: { count: summary.FOLLOW_UP },
    };
  }

  async getKpis(orgId: string) {
    // 1. Avg Legal Review Days
    const reviews = await this.prisma.legalReview.findMany({
      where: { organizationId: orgId, reviewedAt: { not: null } },
      select: { createdAt: true, reviewedAt: true },
    });
    
    let avgLegalReviewDays = 0;
    if (reviews.length > 0) {
      const totalDays = reviews.reduce((acc, r) => {
        const diff = r.reviewedAt.getTime() - r.createdAt.getTime();
        return acc + diff / (1000 * 60 * 60 * 24);
      }, 0);
      avgLegalReviewDays = parseFloat((totalDays / reviews.length).toFixed(1));
    }

    // 2. Average Time to Assignment
    const candidatesWithAssignment = await this.prisma.candidate.findMany({
      where: { organizationId: orgId, assignments: { some: {} } },
      include: { assignments: { orderBy: { createdAt: 'asc' }, take: 1 } },
    });

    let avgTimeToAssignment = 0;
    if (candidatesWithAssignment.length > 0) {
      const totalDays = candidatesWithAssignment.reduce((acc, c) => {
        const diff = c.assignments[0].createdAt.getTime() - c.createdAt.getTime();
        return acc + diff / (1000 * 60 * 60 * 24);
      }, 0);
      avgTimeToAssignment = parseFloat((totalDays / candidatesWithAssignment.length).toFixed(1));
    }

    // 3. Arrivals This Week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const arrivalsThisWeek = await this.prisma.assignment.count({
      where: {
        organizationId: orgId,
        startDate: { gte: startOfWeek },
      },
    });

    // 4. Legal Blockers
    const legalBlockers = await this.prisma.legalReview.count({
      where: {
        organizationId: orgId,
        status: { in: [LegalReviewStatus.PENDING, LegalReviewStatus.REJECTED] },
      },
    });

    return {
      avgLegalReviewDays,
      avgTimeToAssignment,
      arrivalsThisWeek,
      legalBlockers,
    };
  }

  async getLegalQueuePreview(orgId: string) {
    const queue = await this.prisma.legalReview.findMany({
      where: {
        organizationId: orgId,
        status: { in: [LegalReviewStatus.PENDING, LegalReviewStatus.IN_REVIEW] },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nationality: true,
            countryOfOrigin: true,
          },
        },
      },
    });

    return queue.map((r) => ({
      id: r.id,
      candidateId: r.candidate.id,
      name: `${r.candidate.firstName} ${r.candidate.lastName}`,
      country: r.candidate.nationality || r.candidate.countryOfOrigin || 'N/A',
      requestedAt: r.createdAt,
      status: r.status,
    }));
  }

  async getTodayActions(orgId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const followUps = await this.prisma.followUp.findMany({
      where: {
        organizationId: orgId,
        scheduledAt: { gte: startOfDay, lte: endOfDay },
      },
      include: { candidate: true },
      orderBy: { scheduledAt: 'asc' },
    });

    return followUps.map((f) => ({
      id: f.id,
      candidateId: f.candidateId,
      title: f.title,
      time: f.scheduledAt,
      type: f.type,
      candidateName: `${f.candidate.firstName} ${f.candidate.lastName}`,
    }));
  }

  async getIntegrationsStatus(orgId: string) {
    const integrations = await this.prisma.organizationIntegration.findMany({
      where: { organizationId: orgId },
    });

    return integrations.map((i) => ({
      provider: i.provider,
      enabled: i.enabled,
      updatedAt: i.updatedAt,
    }));
  }
}
