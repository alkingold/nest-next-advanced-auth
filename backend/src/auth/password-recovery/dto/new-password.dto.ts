import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsString({ message: 'Password should be a string' })
  @MinLength(6, { message: 'Password should contain at least 6 characters' })
  @IsNotEmpty({ message: 'Password field should not be empty' })
  password!: string;
}
