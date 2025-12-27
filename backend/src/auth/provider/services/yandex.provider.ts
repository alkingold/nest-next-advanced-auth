import { BaseOAuthService } from '@src/auth/provider/services/base-oauth.service';
import { TypeProviderOptions } from '@src/auth/provider/services/types/provider-options.types';
import { TypeUserInfo } from '@src/auth/provider/services/types/user-info.types';

export class YandexProvider extends BaseOAuthService {
  public constructor(options: TypeProviderOptions) {
    super({
      name: 'yandex',
      authorize_url: 'https://oauth.yandex.com/authorize',
      access_url: 'https://oauth.yandex.com/token',
      profile_url: 'https://login.yandex.ru/info?format=json',
      scopes: options.scopes,
      client_id: options.client_id,
      client_secret: options.client_secret,
    });
  }

  public async extractUserInfo(data: YandexProfile): Promise<TypeUserInfo> {
    return super.extractUserInfo({
      id: data.id,
      email: data.default_email,
      name: data.real_name ?? data.display_name ?? null,
      picture: data.default_avatar_id
        ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
        : '',
      provider: 'yandex',
    });
  }
}

interface YandexProfile extends Record<string, any> {
  id: string;
  login: string;
  default_email: string;
  real_name: string;
  first_name: string;
  last_name: string;
  display_name: string;
  default_avatar_id: string;
}
