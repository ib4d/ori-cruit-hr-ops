import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

import { CreateFollowUpDto, UpdateFollowUpStatusDto } from './dto/follow-up.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class FollowUpsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFollowUpDto, orgId: string, userId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, organizationId: orgId },
    });
    if (!candidate) throw new ForbiddenException('Candidate not found');

    return this.prisma.followUp.create({
      data: {
        candidateId: dto.candidateId,
        organizationId: orgId,
        userId,
        title: dto.title,
        notes: dto.notes,
        type: dto.type || 'MANUAL',
        channel: dto.channel || 'whatsapp',
        status: dto.status || 'PENDING',
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async findAll(orgId: string, status?: string) {
    return this.prisma.followUp.findMany({
      where: {
        organizationId: orgId,
        ...(status ? { status } : {}),
      },
      orderBy: { scheduledAt: 'asc' },
      include: { candidate: true },
    });
  }

  async updateStatus(id: string, dto: UpdateFollowUpStatusDto, orgId: string) {
    const followUp = await this.prisma.followUp.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!followUp) throw new NotFoundException('Follow-up not found');

    return this.prisma.followUp.update({
      where: { id },
      data: {
        status: dto.status,
        completedAt: dto.status === 'COMPLETED' ? new Date() : null,
      },
    });
  }

  async findDue() {
    return this.prisma.followUp.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: { lte: new Date() },
      },
      include: { organization: true, candidate: true, user: true },
    });
  }
}
