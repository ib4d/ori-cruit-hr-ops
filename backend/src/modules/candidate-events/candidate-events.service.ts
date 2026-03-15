import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CandidateEventsService {
  constructor(private readonly prisma: PrismaService) {}
  // TODO: implement endpoints
}
