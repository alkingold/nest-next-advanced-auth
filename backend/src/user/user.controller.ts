import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UserRole } from '@prisma/generated/enums';
import { Authorization } from '@src/auth/decorators/auth.decorator';
import { Authorized } from '@src/auth/decorators/authorized.decorator';
import { UpdateUserDto } from '@src/user/dto/update-user.dto';
import { UserEntity } from '@src/user/entities/user.entity';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  public async findProfile(@Authorized('id') userId: string) {
    const user = await this.userService.findById(userId);
    return new UserEntity(user);
  }

  @Authorization(UserRole.ADMIN)
  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return new UserEntity(user);
  }

  @Authorization()
  @Patch('profile')
  public async update(
    @Authorized('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(userId, dto);
    return new UserEntity(updatedUser);
  }
}
