import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserRole } from '@prisma/generated/enums';
import { Authorization } from '@src/auth/decorators/auth.decorator';
import { Authorized } from '@src/auth/decorators/authorized.decorator';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
