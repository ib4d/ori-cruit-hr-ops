import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/assignment.dto';
import { CandidateStatus } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssignmentDto, orgId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, organizationId: orgId },
    });
    if (!candidate) throw new ForbiddenException('Candidate not found');

    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, organizationId: orgId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const assignment = await this.prisma.assignment.create({
      data: {
        candidateId: dto.candidateId,
        projectId: dto.projectId,
        organizationId: orgId,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        notes: dto.notes,
      },
    });

    // Update candidate status to ASSIGNED
    await this.prisma.candidate.update({
      where: { id: dto.candidateId },
      data: { status: CandidateStatus.ASSIGNED },
    });

    return assignment;
  }

  async remove(id: string, orgId: string) {
    const assignment = await this.prisma.assignment.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    await this.prisma.assignment.delete({ where: { id } });

    // Check if candidate has other assignments, if not, maybe revert status?
    // For now, we'll just keep it as is or move to ACTIVE if they were assigned before.
    return { success: true };
  }

  async findAll(orgId: string) {
    return this.prisma.assignment.findMany({
      where: { organizationId: orgId },
      include: { candidate: true, project: true },
    });
  }
}
