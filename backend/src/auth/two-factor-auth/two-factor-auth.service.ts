import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenType } from '@prisma/generated/enums';
import { addMillisecondsFromNow } from '@src/libs/common/utils/date.util';
import { generateSixDigitCode } from '@src/libs/common/utils/token.util';
import { MailService } from '@src/libs/mail/mail.service';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class TwoFactorAuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async validateTwoFactorToken(email: string, code: string) {
    // Check if token for passed email exists in db
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Two factor authentication token is not found. Please check that you asked for a token for this email address.',
      );
    }

    // Check if passed code matches the token in db
    if (existingToken.token !== code) {
      throw new UnauthorizedException(
        'Wrong two factor authentication code. Please check entered code and try again',
      );
    }

    // Check if token has not expired
    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new UnauthorizedException(
        'Two factor authentication token has expired. Please ask for a new one.',
      );
    }

    // Delete token from db after all checks
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR,
      },
    });

    return true;
  }

  public async sendTwoFactorToken(email: string) {
    // Generate token
    const twoFactorToken = await this.generateTwoFactorToken(email);

    // Send mail with generated code to the passed email
    await this.mailService.sendTwoFactorEmail(
      twoFactorToken.email,
      twoFactorToken.token,
    );

    return true;
  }

  private async generateTwoFactorToken(email: string) {
    // Configure token
    const token = generateSixDigitCode();
    const fifteenMinutesInMilliseconds = 60 * 15 * 1000;
    const expiresAt = addMillisecondsFromNow(fifteenMinutesInMilliseconds);

    // Delete previous token if exists
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.TWO_FACTOR,
        },
      });
    }

    // Create new token in database
    const twoFactorToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn: expiresAt,
        type: TokenType.TWO_FACTOR,
      },
    });

    return twoFactorToken;
  }
}
