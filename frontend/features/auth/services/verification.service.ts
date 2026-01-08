import { EmailConfirmationDto } from '@/features/auth/dtos';
import { IUser, VerificationTokenType } from '@/features/auth/types';

import { api } from '@/shared/api';

class VerificationService {
  public confirmEmailByToken(token: VerificationTokenType) {
    return api.post<IUser, EmailConfirmationDto>('auth/email-confirmation', {
      token,
    });
  }
}

export const verificationService = new VerificationService();
