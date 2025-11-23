import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import connectionsConfig from '@src/config/connections.config';
import { IS_DEV_ENV } from '@src/libs/common/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
      load: [connectionsConfig],
    }),
  ],
})
export class AppModule {}
