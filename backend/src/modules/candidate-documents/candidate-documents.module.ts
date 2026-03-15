import { Module } from '@nestjs/common';
import { CandidateDocumentsController } from './candidate-documents.controller';
import { CandidateDocumentsService } from './candidate-documents.service';

@Module({
  controllers: [CandidateDocumentsController],
  providers: [CandidateDocumentsService],
  exports: [CandidateDocumentsService],
})
export class CandidateDocumentsModule {}
