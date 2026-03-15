import { IsString, IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class CreateCandidateDocumentDto {
  @IsUUID()
  candidateId: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
