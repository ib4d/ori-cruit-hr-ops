import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

import { CreateMessageTemplateDto } from './dto/create-template.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MessageTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMessageTemplateDto, orgId: string) {
    return this.prisma.messageTemplate.create({
      data: {
        ...dto,
        organizationId: orgId,
      },
    });
  }

  async findAll(orgId: string, locale?: string) {
    return this.prisma.messageTemplate.findMany({
      where: {
        organizationId: orgId,
        ...(locale ? { locale } : {}),
      },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string, orgId: string) {
    const template = await this.prisma.messageTemplate.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async update(id: string, dto: Partial<CreateMessageTemplateDto>, orgId: string) {
    await this.findOne(id, orgId);
    return this.prisma.messageTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, orgId: string) {
    await this.findOne(id, orgId);
    return this.prisma.messageTemplate.delete({
      where: { id },
    });
  }
}
