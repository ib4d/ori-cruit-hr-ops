import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { IntegrationsModule } from '../integrations/integrations.module';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';

@Module({
  imports: [IntegrationsModule, MessageTemplatesModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
