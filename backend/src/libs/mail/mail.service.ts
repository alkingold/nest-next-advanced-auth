import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from '@src/libs/mail/templates/confirmation.template';
import { ResetPasswordTemplate } from '@src/libs/mail/templates/reset-password.template';
import { TwoFactorAuthTemplate } from '@src/libs/mail/templates/two-factor-auth.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

    const template = await render(ConfirmationTemplate({ domain, token }));

    return this.sendMail(email, 'Email Confirmation', template);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

    const template = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, 'Reset Password', template);
  }

  public async sendTwoFactorEmail(email: string, token: string) {
    const template = await render(TwoFactorAuthTemplate({ token }));

    return this.sendMail(email, 'Identity Confirmation', template);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
