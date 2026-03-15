import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentOrg() org: any) {
    return this.projectsService.create(dto, org.id);
  }

  @Get()
  findAll(@CurrentOrg() org: any) {
    return this.projectsService.findAll(org.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.projectsService.findOne(id, org.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @CurrentOrg() org: any) {
    return this.projectsService.update(id, dto, org.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.projectsService.remove(id, org.id);
  }
}
