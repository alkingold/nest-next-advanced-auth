import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import connectionsConfig from '@src/config/connections.config';
import { IS_DEV_ENV } from '@src/libs/common/utils/is-dev.util';
import { PrismaModule } from '@src/prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { ProviderModule } from './auth/provider/provider.module';
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
  ],
})
export class AppModule {}
