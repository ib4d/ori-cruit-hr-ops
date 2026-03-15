import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CandidateStatus } from '@prisma/client';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCandidateDto, orgId: string) {
    const candidate = await this.prisma.candidate.create({
      data: { ...dto, organizationId: orgId },
    });
    await this.logEvent(candidate.id, orgId, 'CANDIDATE_CREATED', { status: candidate.status });
    return candidate;
  }

  async findAll(orgId: string, opts: { status?: string; search?: string; page: number; limit: number }) {
    const { status, search, page, limit } = opts;
    const where: any = { organizationId: orgId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: { include: { project: true }, take: 1 },
          _count: { select: { documents: true, events: true } },
        },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, orgId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id, organizationId: orgId },
      include: {
        documents: true,
        legalReviews: { orderBy: { createdAt: 'desc' }, take: 5 },
        assignments: { include: { project: true } },
        payments: true,
        followUps: { orderBy: { scheduledAt: 'asc' } },
        consents: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 20 },
        events: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(id: string, dto: UpdateCandidateDto, orgId: string) {
    await this.assertOwnership(id, orgId);
    return this.prisma.candidate.update({ where: { id }, data: dto as any });
  }

  async updateStatus(id: string, status: CandidateStatus, orgId: string) {
    await this.assertOwnership(id, orgId);
    const candidate = await this.prisma.candidate.update({ where: { id }, data: { status } });
    await this.logEvent(id, orgId, 'STATUS_CHANGED', { status });
    return candidate;
  }

  async remove(id: string, orgId: string) {
    await this.assertOwnership(id, orgId);
    return this.prisma.candidate.delete({ where: { id } });
  }

  async exportData(id: string, orgId: string) {
    await this.assertOwnership(id, orgId);
    const candidate = await this.prisma.candidate.findFirst({
      where: { id, organizationId: orgId },
      include: { documents: true, consents: true, messages: true, payments: true, events: true },
    });
    await this.logEvent(id, orgId, 'DATA_EXPORTED', {});
    return candidate;
  }

  async anonymise(id: string, orgId: string) {
    await this.assertOwnership(id, orgId);
    const anonymised = await this.prisma.candidate.update({
      where: { id },
      data: {
        firstName: 'ANONYMISED',
        lastName: 'ANONYMISED',
        email: null,
        phone: null,
        whatsappNumber: null,
        notes: null,
        status: 'CLOSED_SUCCESS',
      },
    });
    await this.logEvent(id, orgId, 'DATA_ANONYMISED', {});
    return anonymised;
  }

  private async assertOwnership(id: string, orgId: string) {
    const c = await this.prisma.candidate.findFirst({ where: { id, organizationId: orgId } });
    if (!c) throw new ForbiddenException('Candidate not found in this organization');
  }

  private async logEvent(candidateId: string, organizationId: string, type: string, payload: any) {
    return this.prisma.candidateEvent.create({
      data: { candidateId, organizationId, type, payload },
    });
  }
}
