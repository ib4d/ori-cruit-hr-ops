import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateFollowUpDto {
  @IsUUID()
  candidateId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(['EMAIL', 'WHATSAPP', 'CALL', 'OTHER'])
  channel?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'CANCELLED'])
  status?: string;
}

export class UpdateFollowUpStatusDto {
  @IsEnum(['PENDING', 'COMPLETED', 'CANCELLED'])
  status: string;
}
