import { LoginDto, RegisterDto } from '@/features/auth/dtos';
import { AuthActionType } from '@/features/auth/types/auth-response.types';
import { IUser } from '@/features/auth/types/user.types';

import { api } from '@/shared/api';

class AuthService {
  public async register(body: RegisterDto, recaptcha?: string) {
    const headers = recaptcha
      ? {
          'X-Recaptcha-Token': recaptcha,
        }
      : undefined;

    return api.post<IUser | AuthActionType, RegisterDto>(
      'auth/register',
      body,
      { headers },
    );
  }

  public async login(body: LoginDto, recaptcha?: string) {
    const headers = recaptcha
      ? {
          'X-Recaptcha-Token': recaptcha,
        }
      : undefined;

    return api.post<IUser | AuthActionType, LoginDto>('auth/login', body, {
      headers,
    });
  }

  public async logout() {
    return api.post('auth/logout');
  }
}

export const authService = new AuthService();
