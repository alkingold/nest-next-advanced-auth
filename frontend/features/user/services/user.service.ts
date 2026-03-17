import { IUser } from '@/features/auth/types';
import { UpdateProfileDto } from '@/features/user/dtos';

import { api } from '@/shared/api';

class UserService {
  public async findProfile() {
    return api.get<IUser>('users/profile');
  }

  public async updateProfile(body: UpdateProfileDto) {
    return api.patch<IUser, UpdateProfileDto>('users/profile', body);
  }
}

export const userService = new UserService();
