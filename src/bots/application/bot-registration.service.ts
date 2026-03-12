/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { RegisterBotDto } from './dto/register-bot.dto.js';
import { BotTokenDto } from './dto/bot-token.dto.js';
import { BotDto } from './dto/bot.dto.js';
import * as crypto from 'crypto';

@Injectable()
export class BotRegistrationService {
  constructor(private prisma: PrismaService) {}

  async registerBot(ownerId: string, dto: RegisterBotDto): Promise<BotDto> {
    const bot = await this.prisma.bot.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId,
        permissions: dto.permissions || [],
      },
    });

    return this.mapBotToDto(bot);
  }

  async generateBotToken(
    botId: string,
    ownerId: string,
    expiresIn?: number,
  ): Promise<BotTokenDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    if (bot.ownerId !== ownerId) {
      throw new BadRequestException('Вы не имеете прав для этого бота');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);

    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000)
      : null;

    const botToken = await this.prisma.botToken.create({
      data: {
        botId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      botId: botToken.botId,
      token,
      tokenHash: botToken.tokenHash,
      createdAt: botToken.createdAt,
      expiresAt: botToken.expiresAt,
    };
  }

  async getUserBots(ownerId: string): Promise<BotDto[]> {
    const bots = await this.prisma.bot.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });

    return bots.map((bot) => this.mapBotToDto(bot));
  }

  async getBotDetails(botId: string): Promise<BotDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    return this.mapBotToDto(bot);
  }

  async updateBotPermissions(
    botId: string,
    ownerId: string,
    permissions: any[],
  ): Promise<BotDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    if (bot.ownerId !== ownerId) {
      throw new BadRequestException('Вы не имеете прав для этого бота');
    }

    const updatedBot = await this.prisma.bot.update({
      where: { id: botId },
      data: { permissions },
    });

    return this.mapBotToDto(updatedBot);
  }

  async revokeToken(tokenId: string, ownerId: string): Promise<void> {
    const token = await this.prisma.botToken.findUnique({
      where: { id: tokenId },
      include: { bot: true },
    });

    if (!token) {
      throw new NotFoundException(`Токен с ID ${tokenId} не найден`);
    }

    if (token.bot.ownerId !== ownerId) {
      throw new BadRequestException('Вы не имеете прав для этого токена');
    }

    await this.prisma.botToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  async getBotTokens(botId: string, ownerId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    if (bot.ownerId !== ownerId) {
      throw new BadRequestException('Вы не имеете прав для этого бота');
    }

    return this.prisma.botToken.findMany({
      where: { botId },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        revoked: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteBot(botId: string, ownerId: string): Promise<void> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    if (bot.ownerId !== ownerId) {
      throw new BadRequestException('Вы не имеете прав для этого бота');
    }

    await this.prisma.bot.delete({
      where: { id: botId },
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private mapBotToDto(bot: any): BotDto {
    return {
      id: bot.id,
      name: bot.name,
      description: bot.description,
      ownerId: bot.ownerId,
      verified: bot.verified,
      permissions: bot.permissions,
      createdAt: bot.createdAt,
      updatedAt: bot.updatedAt,
    };
  }
}
