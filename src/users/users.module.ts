import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma.module.js';
import { UserService } from './application/user.service.js';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
