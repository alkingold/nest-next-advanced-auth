import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TypeBaseProviderOptions } from '@src/auth/provider/services/types/base-provider-options.types';
import { TypeUserInfo } from '@src/auth/provider/services/types/user-info.types';

@Injectable()
export class BaseOAuthService {
  private BASE_URL: string = '';

  public constructor(private readonly options: TypeBaseProviderOptions) {}

  protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
    return {
      ...data,
      provider: this.options.name,
    };
  }

  /**
   * Generates the OAuth authorization URL.
   * @returns {string} generated OAuth authorization URL
   */
  public getAuthUrl(): string {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.client_id,
      redirect_uri: this.getRedirectUrl(),
      scope: (this.options.scopes ?? []).join(' '),
      access_type: 'offline',
      prompt: 'select_account',
    });
    return `${this.options.authorize_url}?${query}`;
  }

  /**
   * Exchange code for tokens
   * and fetch user information
   * @param code {string} Code to exchange
   * @returns {Promise<TypeUserInfo>} User information
   */
  public async findUserByCode(code: string): Promise<TypeUserInfo> {
    const client_id = this.options.client_id;
    const client_secret = this.options.client_secret;

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
    });

    const tokenRequest = await fetch(this.options.access_url, {
      method: 'POST',
      body: tokenQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    if (!tokenRequest.ok) {
      throw new BadRequestException(
        `Failed to obtain user from ${this.options.profile_url}. Please check authorization token`,
      );
    }

    const tokens = await tokenRequest.json();

    if (!tokens.access_token) {
      throw new BadRequestException(
        `There is no tokens with ${this.options.access_url}, please check that authorization code is valid.`,
      );
    }

    const userRequest = await fetch(this.options.profile_url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userRequest.ok) {
      throw new UnauthorizedException(
        `Failed to obtain user from ${this.options.profile_url}. Please check access token`,
      );
    }

    const user = await userRequest.json();
    const userData = await this.extractUserInfo(user);
    console.log('USER DATA', userData);

    return {
      ...userData,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || tokens.expires_in,
      provider: this.options.name,
    };
  }

  /**
   * Builds redirect URL for OAuth provider
   * @returns {string} URL to redirect after OAuth authorization
   */
  public getRedirectUrl(): string {
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
  }

  set baseUrl(value: string) {
    this.BASE_URL = value;
  }

  get name(): string {
    return this.options.name;
  }

  get access_url(): string {
    return this.options.access_url;
  }

  get profile_url(): string {
    return this.options.profile_url;
  }

  get scopes(): string[] {
    return this.options.scopes;
  }
}
