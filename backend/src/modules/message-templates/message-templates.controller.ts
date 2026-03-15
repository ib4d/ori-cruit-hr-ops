import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageTemplatesService } from './message-templates.service';
import { CreateMessageTemplateDto } from './dto/create-template.dto';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('message-templates')
@UseGuards(AuthGuard('jwt'))
export class MessageTemplatesController {
  constructor(private readonly service: MessageTemplatesService) {}

  @Post()
  create(@Body() dto: CreateMessageTemplateDto, @CurrentOrg() org: any) {
    return this.service.create(dto, org.id);
  }

  @Get()
  findAll(@CurrentOrg() org: any, @Query('locale') locale?: string) {
    return this.service.findAll(org.id, locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.service.findOne(id, org.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMessageTemplateDto>,
    @CurrentOrg() org: any,
  ) {
    return this.service.update(id, dto, org.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.service.remove(id, org.id);
  }
}
