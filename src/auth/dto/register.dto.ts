import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

import { IsPasswordsMatchingConstraint } from '@src/libs/common/decorators/is-passwords-matching.decorator';

export class RegisterDto {
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name field is mandatory' })
  name!: string;

  @IsString({ message: 'Email should be a string' })
  @IsEmail({}, { message: 'Should be a valid email' })
  @IsNotEmpty({ message: 'Email field is mandatory' })
  email!: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password field is mandatory' })
  @MinLength(6, {
    message: 'Password should contain at least 6 characters',
  })
  password!: string;

  @IsString({ message: 'Password confirmation should be a string' })
  @IsNotEmpty({ message: 'Password confirmation is mandatory' })
  @MinLength(6, {
    message: 'Password confirmation should contain at least 6 characters',
  })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Password and confirmation should match',
  })
  passwordRepeat!: string;
}
