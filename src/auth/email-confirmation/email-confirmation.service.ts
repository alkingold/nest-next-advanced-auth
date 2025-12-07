import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/generated/client';
import { TokenType } from '@prisma/generated/enums';
import { AuthService } from '@src/auth/auth.service';
import { ConfirmationDto } from '@src/auth/email-confirmation/dto/confirmation.dto';
import {
  addMillisecondsFromNow,
  ONE_HOUR_IN_MS,
} from '@src/libs/common/utils/date.util';
import { MailService } from '@src/libs/mail/mail.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { UserService } from '@src/user/user.service';

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async newVerification(req: Request, dto: ConfirmationDto) {
    // Find token in database
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION,
      },
    });

    // Check if token exists
    if (!existingToken) {
      throw new NotFoundException(
        'Confirmation token is not found. Please check your token',
      );
    }

    // Check if token is not expired
    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired) {
      throw new BadRequestException(
        'Confirmation token is expired. Please ask for a new confirmation token',
      );
    }

    // Find user for passed token
    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        'User with this email is not found. Please check entered email.',
      );
    }

    // Update user to verified state
    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isVerified: true,
      },
    });

    // Delete token from database
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    });

    // Create user session
    return this.authService.saveSession(req, existingUser);
  }

  public async sendVerificationToken(user: User) {
    const verificationToken = await this.generateVerificationToken(user.email);

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return true;
  }

  private async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expiresAt = addMillisecondsFromNow(ONE_HOUR_IN_MS);

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
      },
    });

    // Token already exists, delete token
    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.VERIFICATION,
        },
      });
    }

    // Token does not exist, create token
    const verificationToken = await this.prismaService.token.create({
      data: {
        token,
        email,
        expiresIn: expiresAt,
        type: TokenType.VERIFICATION,
      },
    });

    return verificationToken;
  }
}
