import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LegalReviewsService } from './legal-reviews.service';
import { CreateLegalReviewDto, UpdateLegalReviewDto } from './dto/legal-review.dto';
import { CurrentOrg, CurrentUser } from '../../common/decorators/auth.decorators';

@Controller('legal-reviews')
@UseGuards(AuthGuard('jwt'))
export class LegalReviewsController {
  constructor(private readonly service: LegalReviewsService) {}

  @Post()
  create(
    @Body() dto: CreateLegalReviewDto,
    @CurrentOrg() org: any,
    @CurrentUser() user: any,
  ) {
    return this.service.create(dto, org.id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLegalReviewDto,
    @CurrentOrg() org: any,
  ) {
    return this.service.update(id, dto, org.id);
  }

  @Get()
  findAll(@CurrentOrg() org: any) {
    return this.service.findAll(org.id);
  }
}
