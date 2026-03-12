import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { BotRegistrationService } from '../application/bot-registration.service.js';
import { RegisterBotDto } from '../application/dto/register-bot.dto.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { TokenPayload } from '../../auth/domain/token-payload.js';

@ApiTags('bots')
@Controller('bots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BotController {
  constructor(
    private readonly botRegistrationService: BotRegistrationService,
  ) {}

  @Post()
  async registerBot(@Req() req: Request, @Body() dto: RegisterBotDto) {
    const user = req.user as TokenPayload;
    return this.botRegistrationService.registerBot(user.sub, dto);
  }

  @Get()
  async getUserBots(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.botRegistrationService.getUserBots(user.sub);
  }

  @Get(':id')
  async getBotDetails(@Param('id') botId: string) {
    return this.botRegistrationService.getBotDetails(botId);
  }

  @Post(':id/tokens')
  @HttpCode(201)
  async generateToken(
    @Req() req: Request,
    @Param('id') botId: string,
    @Body('expiresIn') expiresIn?: number,
  ) {
    const user = req.user as TokenPayload;
    return this.botRegistrationService.generateBotToken(
      botId,
      user.sub,
      expiresIn,
    );
  }

  @Get(':id/tokens')
  async getBotTokens(@Req() req: Request, @Param('id') botId: string) {
    const user = req.user as TokenPayload;
    return this.botRegistrationService.getBotTokens(botId, user.sub);
  }

  @Delete(':botId/tokens/:tokenId')
  @HttpCode(204)
  async revokeToken(@Req() req: Request, @Param('tokenId') tokenId: string) {
    const user = req.user as TokenPayload;
    await this.botRegistrationService.revokeToken(tokenId, user.sub);
  }

  @Patch(':id')
  async updateBotPermissions(
    @Req() req: Request,
    @Param('id') botId: string,
    @Body('permissions') permissions: any[],
  ) {
    const user = req.user as TokenPayload;
    return this.botRegistrationService.updateBotPermissions(
      botId,
      user.sub,
      permissions,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBot(@Req() req: Request, @Param('id') botId: string) {
    const user = req.user as TokenPayload;
    await this.botRegistrationService.deleteBot(botId, user.sub);
  }
}
