import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateLegalReviewDto, UpdateLegalReviewDto } from './dto/legal-review.dto';
import { CandidateStatus, LegalReviewStatus } from '@prisma/client';

@Injectable()
export class LegalReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLegalReviewDto, orgId: string, userId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, organizationId: orgId },
    });
    if (!candidate) throw new ForbiddenException('Candidate not found');

    const review = await this.prisma.legalReview.create({
      data: {
        candidateId: dto.candidateId,
        organizationId: orgId,
        status: LegalReviewStatus.PENDING,
        notes: dto.notes,
        reviewedBy: userId,
      },
    });

    // Update candidate status to LEGAL_REVIEW
    await this.prisma.candidate.update({
      where: { id: dto.candidateId },
      data: { status: CandidateStatus.LEGAL_REVIEW },
    });

    return review;
  }

  async update(id: string, dto: UpdateLegalReviewDto, orgId: string) {
    const review = await this.prisma.legalReview.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!review) throw new NotFoundException('Legal review not found');

    const updatedReview = await this.prisma.legalReview.update({
      where: { id },
      data: {
        status: dto.status,
        reason: dto.reason,
        notes: dto.notes,
        reviewedAt: new Date(),
      },
    });

    // Sync candidate status
    let candidateStatus: CandidateStatus;
    if (dto.status === LegalReviewStatus.APPROVED) {
      candidateStatus = CandidateStatus.LEGAL_APPROVED;
    } else if (dto.status === LegalReviewStatus.REJECTED) {
      candidateStatus = CandidateStatus.LEGAL_REJECTED;
    }

    if (candidateStatus) {
      await this.prisma.candidate.update({
        where: { id: review.candidateId },
        data: { status: candidateStatus },
      });
    }

    return updatedReview;
  }

  async findAll(orgId: string) {
    return this.prisma.legalReview.findMany({
      where: { organizationId: orgId },
      include: { candidate: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
