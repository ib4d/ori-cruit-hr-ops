import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('candidates')
@UseGuards(AuthGuard('jwt'))
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  create(@Body() dto: CreateCandidateDto, @CurrentOrg() org: any) {
    return this.candidatesService.create(dto, org.id);
  }

  @Get()
  findAll(
    @CurrentOrg() org: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.candidatesService.findAll(org.id, { status, search, page: +(page ?? 1), limit: +(limit ?? 20) });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.candidatesService.findOne(id, org.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCandidateDto, @CurrentOrg() org: any) {
    return this.candidatesService.update(id, dto, org.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentOrg() org: any,
  ) {
    return this.candidatesService.updateStatus(id, body.status as any, org.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.candidatesService.remove(id, org.id);
  }

  @Get(':id/export')
  exportData(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.candidatesService.exportData(id, org.id);
  }

  @Delete(':id/anonymise')
  anonymise(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.candidatesService.anonymise(id, org.id);
  }
}
