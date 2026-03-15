import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEnum(['EMAIL', 'WHATSAPP'])
  channel: 'EMAIL' | 'WHATSAPP';

  @IsString()
  @IsNotEmpty()
  locale: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];
}
