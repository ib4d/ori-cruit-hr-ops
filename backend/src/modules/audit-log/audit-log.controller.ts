import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
@UseGuards(AuthGuard('jwt'))
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Get()
  findAll() {
    return this.service;
  }
}
