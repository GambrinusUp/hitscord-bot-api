import { BotPermissionType } from '../../domain/enums.js';

export class BotDto {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  verified: boolean;
  permissions: BotPermissionType[];
  createdAt: Date;
  updatedAt: Date;
}
