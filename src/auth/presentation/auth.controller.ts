import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../application/auth.service.js';
import { LoginDto } from '../application/dto/login.dto.js';
import { RegisterDto } from '../application/dto/register.dto.js';
import { TokenPayload } from '../domain/token-payload.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { ProfileDto } from './dto/profile.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ type: AuthResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileDto })
  async profile(@Req() req: Request): Promise<ProfileDto> {
    const user = req.user as TokenPayload;
    return this.authService.profile(user.sub);
  }
}
