import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Name should be a string.' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Email should be a string' })
  @IsEmail({}, { message: 'Email format is incorrect.' })
  @IsOptional()
  email?: string;

  @IsBoolean({ message: 'isTwoFactorEnabled field should be a boolean.' })
  @IsOptional()
  isTwoFactorEnabled?: boolean;
}
