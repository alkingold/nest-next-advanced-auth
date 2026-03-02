import { Exclude, Expose } from 'class-transformer';

import { Account, User } from '@prisma/generated/client';
import { AuthMethod, UserRole } from '@prisma/generated/enums';

export class UserEntity {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  // Exposed fields

  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  displayName!: string;

  @Expose()
  picture?: string | null;

  // Protected fields

  @Exclude()
  password!: string;

  @Exclude()
  role!: UserRole;

  @Exclude()
  isVerified!: boolean;

  @Exclude()
  isTwoFactorEnabled!: boolean;

  @Exclude()
  method!: AuthMethod;

  @Exclude()
  accounts?: Account;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}
