import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ConsentsService {
  constructor(private readonly prisma: PrismaService) {}
  // TODO: implement endpoints
}
