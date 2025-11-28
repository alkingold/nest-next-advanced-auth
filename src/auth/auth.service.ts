import { verify } from 'argon2';
import { Request, Response } from 'express';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/generated/client';
import { AuthMethod } from '@prisma/generated/enums';
import { LoginDto } from '@src/auth/dto/login.dto';
import { RegisterDto } from '@src/auth/dto/register.dto';
import { SessionUtils } from '@src/libs/common/utils/SessionUtils';
import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const { email, password, name: displayName } = dto;
    const picture = '';
    const isVerified = false;

    const isExisting = await this.userService.findByEmail(email);

    if (isExisting) {
      throw new ConflictException(
        'User with this email already exists, please use another email or log in the system',
      );
    }

    const newUser = await this.userService.create(
      email,
      password,
      displayName,
      picture,
      AuthMethod.CREDENTIALS,
      isVerified,
    );

    return this.saveSession(req, newUser);
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException(
        'User not found, please check your credentials',
      );
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Invalid password, please check your credentials',
      );
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const session = new SessionUtils(req);
    await session.safeSessionDestroy();
    res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
  }

  private async saveSession(req: Request, user: User): Promise<{ user: User }> {
    req.session.userId = user.id;
    const session = new SessionUtils(req);
    await session.safeSessionSave();
    return { user };
  }
}
