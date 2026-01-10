import { PasswordRecoveryDto } from '@/features/auth/dtos';

import { api } from '@/shared/api';

class PasswordRecoveryService {
  public reset(body: PasswordRecoveryDto, recaptcha?: string) {
    const headers = recaptcha
      ? {
          'X-Recaptcha-Token': recaptcha,
        }
      : undefined;

    return api.post<boolean, PasswordRecoveryDto>(
      'auth/password-recovery/reset',
      body,
      { headers },
    );
  }
}

export const passwordRecoveryService = new PasswordRecoveryService();
