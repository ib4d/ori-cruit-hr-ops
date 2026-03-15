import { IsString, IsOptional, IsHexColor, IsArray } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  primaryDomain?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  localeDefault?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedLocales?: string[];
}
