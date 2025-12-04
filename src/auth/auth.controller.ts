import { Request, Response } from 'express';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { LoginDto } from '@src/auth/dto/login.dto';
import { RegisterDto } from '@src/auth/dto/register.dto';
import { AuthProviderGuard } from '@src/auth/guards/provider.guard';
import { ProviderService } from '@src/auth/provider/provider.service';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
  ) {}

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Req() req: Request, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.authService.login(req, dto);
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/callback/:provider')
  public async callback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string,
  ) {
    if (!code) {
      throw new BadRequestException('Authorization code is missing');
    }

    await this.authService.extractProfileFromCode(req, provider, code);

    res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
    );
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider);

    return {
      url: providerInstance!.getAuthUrl(),
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);

    res.status(HttpStatus.NO_CONTENT).end();
  }
}
