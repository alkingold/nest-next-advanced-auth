export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginTwoFactorDto {
  code: string;
}
