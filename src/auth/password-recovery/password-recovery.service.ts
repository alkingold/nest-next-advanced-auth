import { hash } from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { Injectable, NotFoundException } from '@nestjs/common';
import { NewPasswordDto } from '@src/auth/password-recovery/dto/new-password.dto';
import { ResetPasswordDto } from '@src/auth/password-recovery/dto/reset-password.dto';
import {
  addMillisecondsFromNow,
  ONE_HOUR_IN_MS,
} from '@src/libs/common/utils/date.util';
import { MailService } from '@src/libs/mail/mail.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { UserService } from '@src/user/user.service';

import { TokenType } from './../../../prisma/generated/enums';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async reset(dto: ResetPasswordDto) {
    // Find user for password reset
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser) {
      throw new NotFoundException(
        'User not found. Please check entered email address adn try again.',
      );
    }

    // generate password reset token
    const passwordResetToken = await this.generatePasswordResetToken(
      existingUser.email,
    );

    // Send reset password email
    await this.mailService.sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    // find reset password token
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Token is not found. Please check entered token or ask for a new one.',
      );
    }

    // find user to reset password
    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        'User not found. Please check entered email and try again.',
      );
    }

    // update user with new password
    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(dto.password),
      },
    });

    // delete reset password token from the database
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }

  private async generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expiresAt = addMillisecondsFromNow(ONE_HOUR_IN_MS);

    // Delete previous reset password token if there is one
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      });
    }

    // Create new reset password token
    const passwordResetToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn: expiresAt,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return passwordResetToken;
  }
}
