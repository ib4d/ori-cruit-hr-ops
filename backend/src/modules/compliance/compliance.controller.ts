import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
@UseGuards(AuthGuard('jwt'))
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  @Get()
  findAll() {
    return this.service;
  }
}
