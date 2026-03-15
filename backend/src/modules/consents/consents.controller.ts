import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConsentsService } from './consents.service';

@Controller('consents')
@UseGuards(AuthGuard('jwt'))
export class ConsentsController {
  constructor(private readonly service: ConsentsService) {}

  @Get()
  findAll() {
    return this.service;
  }
}
