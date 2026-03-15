import { Module } from '@nestjs/common';
import { LegalReviewsController } from './legal-reviews.controller';
import { LegalReviewsService } from './legal-reviews.service';

@Module({
  controllers: [LegalReviewsController],
  providers: [LegalReviewsService],
  exports: [LegalReviewsService],
})
export class LegalReviewsModule {}
