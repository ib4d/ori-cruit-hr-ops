import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsIn(['en', 'es', 'pl'])
  languagePreference?: string;
}
