import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsIn } from 'class-validator';
import { CreateCandidateDto } from './create-candidate.dto';
import { CandidateStatus } from '@prisma/client';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
  @IsOptional()
  @IsIn(Object.values(CandidateStatus))
  status?: CandidateStatus;
}
