import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateAssignmentDto {
  @IsUUID()
  candidateId: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
