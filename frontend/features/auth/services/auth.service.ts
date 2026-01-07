import { LoginDto, RegisterDto } from '@/features/auth/dtos';
import {
  AuthActionType,
  IUser,
  OAuthProviderType,
  OAuthRedirectResponse,
} from '@/features/auth/types';

import { api } from '@/shared/api';

class AuthService {
  public register(body: RegisterDto, recaptcha?: string) {
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

  public oauthByProvider(provider: OAuthProviderType) {
    return api.get<OAuthRedirectResponse>(`auth/oauth/connect/${provider}`);
  }

  public login(body: LoginDto, recaptcha?: string) {
    const headers = recaptcha
      ? {
          'X-Recaptcha-Token': recaptcha,
        }
      : undefined;

    return api.post<IUser | AuthActionType, LoginDto>('auth/login', body, {
      headers,
    });
  }

  public logout() {
    return api.post('auth/logout');
  }
}

export const authService = new AuthService();
