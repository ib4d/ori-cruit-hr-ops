import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/assignment.dto';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post()
  create(@Body() dto: CreateAssignmentDto, @CurrentOrg() org: any) {
    return this.service.create(dto, org.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.service.remove(id, org.id);
  }

  @Get()
  findAll(@CurrentOrg() org: any) {
    return this.service.findAll(org.id);
  }
}
