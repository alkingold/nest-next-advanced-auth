import { Request } from 'express';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/generated/client';
import { AuthMethod } from '@prisma/generated/enums';
import { RegisterDto } from '@src/auth/dto/register.dto';
import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService) {}

  public async register(req: Request, dto: RegisterDto) {
    const { email, password, name: displayName } = dto;
    const picture = '';
    const isVerified = false;

    const isExisting = await this.userService.findByEmail(email);

    if (isExisting) {
      throw new ConflictException(
        'User with this email already exists, please use another email or log in the system',
      );
    }

    const newUser = await this.userService.create(
      email,
      password,
      displayName,
      picture,
      AuthMethod.CREDENTIALS,
      isVerified,
    );

    return this.saveSession(req, newUser);
  }

  public async login() {}

  public async logout() {}

  private async saveSession(req: Request, user: User): Promise<{ user: User }> {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          console.error('Session save error: ', err);
          return reject(
            new InternalServerErrorException(
              'Could not save session, please check session parameters',
            ),
          );
        }

        resolve({ user });
      });
    });
  }
}
