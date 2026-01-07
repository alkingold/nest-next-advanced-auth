export type AuthActionType = {
  message: string;
};

export type OAuthProviderType = 'google' | 'yandex';

export type OAuthRedirectResponse = {
  url: string;
};
