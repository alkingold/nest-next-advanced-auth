import { verify } from 'argon2';
import { Request, Response } from 'express';

import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/generated/client';
import { AuthMethod } from '@prisma/generated/enums';
import { LoginDto } from '@src/auth/dto/login.dto';
import { RegisterDto } from '@src/auth/dto/register.dto';
import { EmailConfirmationService } from '@src/auth/email-confirmation/email-confirmation.service';
import { ProviderService } from '@src/auth/provider/provider.service';
import { TwoFactorAuthService } from '@src/auth/two-factor-auth/two-factor-auth.service';
import { SessionUtils } from '@src/libs/common/utils/SessionUtils';
import { UserService } from '@src/user/user.service';

import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => EmailConfirmationService))
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
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

    await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      message:
        'Registration successful. Please confirm your email address. A message was sent to your address.',
    };
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    // get provider instance
    const providerInstance = this.providerService.findByService(provider);

    if (!providerInstance) {
      throw new BadRequestException(
        `Provider ${provider} is not supported. Please use another one.`,
      );
    }

    // fetch profile from provider
    const profile = await providerInstance.findUserByCode(code);

    if (!profile?.email) {
      throw new UnauthorizedException(
        'Could not extract user profile from the provider. Please try again.',
      );
    }

    const providerAccountId = String(profile.id);
    const supportsEmailVerification = 'email_verified' in profile;

    // check is email is verified if the provider supports it
    if (supportsEmailVerification && profile.email_verified === false) {
      throw new UnauthorizedException(
        'Email is not verified by the provider. Please verify your email to proceed.',
      );
    }

    // check if an account for this user with this provider already exists
    const existingAccount = await this.prismaService.account.findFirst({
      where: {
        provider: profile.provider,
        providerAccountId,
      },
      include: { user: true },
    });

    // if account exists, log in the user
    if (existingAccount?.user) {
      await this.prismaService.account.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          accessToken: profile.access_token ?? existingAccount.accessToken,
          refreshToken: profile.refresh_token ?? existingAccount.refreshToken,
          expiresAt: profile.expires_at ?? existingAccount.expiresAt,
        },
      });

      return this.saveSession(req, existingAccount.user);
    }

    // check if a user with this email already exists
    const existingUser = await this.userService.findByEmail(profile.email);

    // if user exists link account to the existing user
    if (existingUser) {
      await this.prismaService.account.create({
        data: {
          userId: existingUser.id,
          type: 'oauth',
          provider: profile.provider,
          providerAccountId,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });

      // Update display name and picture from provider
      await this.prismaService.user.update({
        where: { id: existingUser.id },
        data: {
          displayName: profile.name ?? existingUser.displayName,
          picture: profile.picture ?? existingUser.picture,
        },
      });

      return this.saveSession(req, existingUser);
    }

    // create a new user and account within a transaction
    const newUser = await this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: profile.email,
          password: '',
          displayName: profile.name,
          picture: profile.picture,
          method:
            AuthMethod[
              profile.provider.toUpperCase() as keyof typeof AuthMethod
            ],
          isVerified: true,
        },
        include: { accounts: true },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          providerAccountId,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });

      return user;
    });

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

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);

      throw new UnauthorizedException(
        'Your email is not confirmed. Please check your mail box and confirm your email.',
      );
    }

    // Handle two factor authentication
    if (user.isTwoFactorEnabled) {
      // Send code to the email if not provided
      if (!dto.code) {
        await this.twoFactorAuthService.sendTwoFactorToken(user.email);

        return {
          message:
            'Please check your email. Two factor authentication code is needed.',
        };
      }

      // Check if provided code is valid
      await this.twoFactorAuthService.validateTwoFactorToken(
        user.email,
        dto.code,
      );
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const session = new SessionUtils(req);
    await session.safeSessionDestroy();
    res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
  }

  public async saveSession(req: Request, user: User): Promise<{ user: User }> {
    req.session.userId = user.id;
    const session = new SessionUtils(req);
    await session.safeSessionSave();
    return { user };
  }
}
