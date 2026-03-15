import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CandidateEventsService } from './candidate-events.service';

@Controller('candidate-events')
@UseGuards(AuthGuard('jwt'))
export class CandidateEventsController {
  constructor(private readonly service: CandidateEventsService) {}

  @Get()
  findAll() {
    return this.service;
  }
}
