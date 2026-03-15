import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';
import { CandidateStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, orgId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, organizationId: orgId },
    });
    if (!candidate) throw new ForbiddenException('Candidate not found');

    const payment = await this.prisma.payment.create({
      data: {
        candidateId: dto.candidateId,
        organizationId: orgId,
        amount: dto.amount,
        currency: dto.currency || 'PLN',
        purpose: dto.purpose || 'LEGALIZATION_FEE',
        status: PaymentStatus.PENDING,
      },
    });

    // Update candidate status to PAYMENT_PENDING
    await this.prisma.candidate.update({
      where: { id: dto.candidateId },
      data: { status: CandidateStatus.PAYMENT_PENDING },
    });

    return payment;
  }

  async updateStatus(id: string, dto: UpdatePaymentStatusDto, orgId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        proofUrl: dto.proofUrl,
        notes: dto.notes,
        paidAt: dto.status === PaymentStatus.PAID ? new Date() : null,
      },
    });

    // Sync candidate status if paid
    if (dto.status === PaymentStatus.PAID) {
      await this.prisma.candidate.update({
        where: { id: payment.candidateId },
        data: { status: CandidateStatus.PAYMENT_DONE },
      });
    }

    return updatedPayment;
  }

  async findAll(orgId: string) {
    return this.prisma.payment.findMany({
      where: { organizationId: orgId },
      include: { candidate: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
