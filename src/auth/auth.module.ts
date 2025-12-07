import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { EmailConfirmationModule } from '@src/auth/email-confirmation/email-confirmation.module';
import { ProviderModule } from '@src/auth/provider/provider.module';
import { getProvidersConfig } from '@src/config/providers.config';
import { getRecaptchaConfig } from '@src/config/recaptcha.config';
import { UserModule } from '@src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    UserModule,
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getRecaptchaConfig,
    }),
    forwardRef(() => EmailConfirmationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
