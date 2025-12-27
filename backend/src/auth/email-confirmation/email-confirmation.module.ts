import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { MailModule } from '@src/libs/mail/mail.module';
import { PrismaModule } from '@src/prisma/prisma.module';
import { UserModule } from '@src/user/user.module';

import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';

@Module({
  imports: [MailModule, PrismaModule, UserModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
