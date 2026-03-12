import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { BotPermissionType } from '../../domain/enums.js';

export class RegisterBotDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(BotPermissionType, { each: true })
  permissions?: BotPermissionType[];
}
