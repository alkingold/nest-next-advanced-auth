import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import connectionsConfig from '@src/config/connections.config';
import { IS_DEV_ENV } from '@src/libs/common/utils/is-dev.util';
import { PrismaModule } from '@src/prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';
import { ProviderModule } from './auth/provider/provider.module';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import { MailModule } from './libs/mail/mail.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
      load: [connectionsConfig],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProviderModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule,
  ],
})
export class AppModule {}
