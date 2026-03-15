import { Module } from '@nestjs/common';
import { CandidateEventsController } from './candidate-events.controller';
import { CandidateEventsService } from './candidate-events.service';

@Module({
  controllers: [CandidateEventsController],
  providers: [CandidateEventsService],
  exports: [CandidateEventsService],
})
export class CandidateEventsModule {}
