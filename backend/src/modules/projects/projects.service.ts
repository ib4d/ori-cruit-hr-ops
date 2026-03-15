import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto, orgId: string) {
    return this.prisma.project.create({
      data: {
        ...dto,
        organizationId: orgId,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.project.findMany({
      where: { organizationId: orgId },
      include: {
        _count: {
          select: { assignments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, orgId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId: orgId },
      include: {
        assignments: {
          include: {
            candidate: true,
          },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, orgId: string) {
    await this.assertOwnership(id, orgId);
    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(id: string, orgId: string) {
    await this.assertOwnership(id, orgId);
    return this.prisma.project.delete({ where: { id } });
  }

  private async assertOwnership(id: string, orgId: string) {
    const p = await this.prisma.project.findFirst({ where: { id, organizationId: orgId } });
    if (!p) throw new ForbiddenException('Project not found in this organization');
  }
}
