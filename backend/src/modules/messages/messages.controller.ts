import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentOrg, CurrentUser } from '../../common/decorators/auth.decorators';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post('send')
  send(
    @Body() dto: SendMessageDto,
    @CurrentOrg() org: any,
    @CurrentUser() user: any,
  ) {
    return this.service.send(dto, org.id, user.sub);
  }

  @Get()
  findAll(@CurrentOrg() org: any, @Query('candidateId') candidateId?: string) {
    return this.service.findAll(org.id, candidateId);
  }
}
