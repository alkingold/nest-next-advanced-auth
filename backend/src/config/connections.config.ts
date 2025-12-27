import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

import { registerAs } from '@nestjs/config';

dotenvExpand.expand(dotenv.config());

export default registerAs('connections', () => {
  const { POSTGRES_URI, REDIS_URI } = process.env;

  return {
    POSTGRES_URI,
    REDIS_URI,
  };
});
