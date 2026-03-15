import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

import { SendMessageDto } from './dto/send-message.dto';
import { IntegrationsService } from '../integrations/integrations.service';
import { MessageTemplatesService } from '../message-templates/message-templates.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrations: IntegrationsService,
    private readonly templates: MessageTemplatesService,
  ) {}

  async send(dto: SendMessageDto, orgId: string, userId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, organizationId: orgId },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');

    let subject = dto.customSubject || '';
    let body = dto.customContent || '';
    let templateCode = null;

    if (dto.templateId) {
      const template = await this.templates.findOne(dto.templateId, orgId);
      subject = template.subject;
      body = template.body;
      templateCode = template.code;
      
      // Basic placeholder replacement
      body = body
        .replace('{{firstName}}', candidate.firstName)
        .replace('{{lastName}}', candidate.lastName);
    }

    if (!body) throw new BadRequestException('Message body is empty');

    let result: any;
    if (dto.channel === 'WHATSAPP') {
      if (!candidate.whatsappNumber && !candidate.phone) {
        throw new BadRequestException('Candidate has no WhatsApp/Phone number');
      }
      result = await this.integrations.sendWhatsApp(
        candidate.whatsappNumber || candidate.phone,
        templateCode || 'custom_message',
        { components: [{ type: 'body', parameters: [{ type: 'text', text: candidate.firstName }] }] },
        orgId
      );
    } else if (dto.channel === 'EMAIL') {
      if (!candidate.email) throw new BadRequestException('Candidate has no email');
      result = await this.integrations.sendEmail(candidate.email, subject, body, orgId);
    }

    // Log the message
    return this.prisma.message.create({
      data: {
        organizationId: orgId,
        candidateId: dto.candidateId,
        userId,
        templateCode,
        channel: dto.channel,
        direction: 'OUTBOUND',
        subject,
        body,
        status: result.status === 'SENT' ? MessageStatus.SENT : MessageStatus.PENDING,
        externalId: result.messageId,
      },
    });
  }

  async findAll(orgId: string, candidateId?: string) {
    return this.prisma.message.findMany({
      where: {
        organizationId: orgId,
        ...(candidateId ? { candidateId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true } } },
    });
  }
}
