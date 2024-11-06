import { IsEmail, IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';

class LoginUserDto {
  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(255)
  @IsNotEmpty()
  password: string;
}

export { LoginUserDto };
