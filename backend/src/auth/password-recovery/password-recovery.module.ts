import { Module } from '@nestjs/common';
import { MailModule } from '@src/libs/mail/mail.module';
import { UserModule } from '@src/user/user.module';

import { PasswordRecoveryController } from './password-recovery.controller';
import { PasswordRecoveryService } from './password-recovery.service';

@Module({
  imports: [UserModule, MailModule],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService],
  exports: [PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
