import { IsString, IsOptional, IsNumber, IsUUID, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsUUID()
  candidateId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  purpose?: string;
}

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  @IsOptional()
  proofUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
