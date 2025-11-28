import { Request } from 'express';
import { promisify } from 'util';

import { InternalServerErrorException } from '@nestjs/common';

export class SessionUtils {
  constructor(private readonly req: Request) {}

  async safeSessionSave() {
    try {
      const save = promisify(this.req.session.save).bind(this.req.session);
      await save();
    } catch (error) {
      console.error('Session save error: ', error);
      throw new InternalServerErrorException(
        'Could not save session, please check session parameters',
      );
    }
  }

  async safeSessionDestroy() {
    try {
      const destroy = promisify(this.req.session.destroy).bind(
        this.req.session,
      );
      await destroy();
    } catch (error) {
      console.error('Session destroy error: ', error);
      throw new InternalServerErrorException(
        'Could not destroy session, there was a server error or session is already destroyed',
      );
    }
  }

  async safeSessionRegenerate() {
    try {
      const regenerate = promisify(this.req.session.regenerate).bind(
        this.req.session,
      );
      await regenerate();
    } catch (error) {
      console.error('Session regenerate error: ', error);
      throw new InternalServerErrorException(
        'Could not regenerate session, please check session parameters',
      );
    }
  }
}
