import { NewPasswordDto, PasswordRecoveryDto } from '@/features/auth/dtos';
import { VerificationTokenType } from '@/features/auth/types';

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

  public createNewPassword(
    body: NewPasswordDto,
    token: VerificationTokenType,
    recaptcha?: string,
  ) {
    const headers = recaptcha
      ? {
          'X-Recaptcha-Token': recaptcha,
        }
      : undefined;

    return api.post<boolean, NewPasswordDto>(
      `auth/password-recovery/new/${token}`,
      body,
      { headers },
    );
  }
}

export const passwordRecoveryService = new PasswordRecoveryService();
