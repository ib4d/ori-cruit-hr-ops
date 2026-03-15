import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { LegalReviewStatus } from '@prisma/client';

export class CreateLegalReviewDto {
  @IsUUID()
  candidateId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateLegalReviewDto {
  @IsEnum(LegalReviewStatus)
  status: LegalReviewStatus;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
