import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
    username!: string;

  @IsNotEmpty()
  @IsEmail()
    email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
    password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
    confirmPassword!: string;
}
