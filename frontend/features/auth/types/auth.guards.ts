import { AuthActionType } from './auth.types';
import { IUser } from './user.types';

export function hasMessage(data: IUser | AuthActionType) {
  return 'message' in data;
}
