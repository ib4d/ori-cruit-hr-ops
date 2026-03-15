import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  candidateId: string;

  @IsOptional()
  @IsUUID()
  templateId?: string;

  @IsEnum(['EMAIL', 'WHATSAPP'])
  channel: 'EMAIL' | 'WHATSAPP';

  @IsOptional()
  @IsString()
  customSubject?: string;

  @IsOptional()
  @IsString()
  customContent?: string;
}
