import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FollowUpsService } from './follow-ups.service';
import { CreateFollowUpDto, UpdateFollowUpStatusDto } from './dto/follow-up.dto';
import { CurrentOrg, CurrentUser } from '../../common/decorators/auth.decorators';

@Controller('follow-ups')
@UseGuards(AuthGuard('jwt'))
export class FollowUpsController {
  constructor(private readonly service: FollowUpsService) {}

  @Post()
  create(
    @Body() dto: CreateFollowUpDto,
    @CurrentOrg() org: any,
    @CurrentUser() user: any,
  ) {
    return this.service.create(dto, org.id, user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFollowUpStatusDto,
    @CurrentOrg() org: any,
  ) {
    return this.service.updateStatus(id, dto, org.id);
  }

  @Get()
  findAll(@CurrentOrg() org: any, @Query('status') status?: string) {
    return this.service.findAll(org.id, status);
  }
}
