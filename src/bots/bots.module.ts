import { Module } from '@nestjs/common';
import { BotRegistrationService } from './application/bot-registration.service.js';
import { BotController } from './presentation/bot.controller.js';
import { PrismaModule } from '../infrastructure/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [BotRegistrationService],
  controllers: [BotController],
  exports: [BotRegistrationService],
})
export class BotsModule {}
