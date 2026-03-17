export interface IUser {
  id: string;
  email: string;
  displayName: string;
  picture: string;
  isTwoFactorEnabled: boolean;
  isTwoFactorAvailable: boolean;
}
