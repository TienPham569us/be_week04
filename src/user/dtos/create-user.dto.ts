import { IsNotEmpty, MaxLength, IsEmail, IsStrongPassword, Matches } from 'class-validator';

class CreateUserDto {
  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @MaxLength(255)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;
}

export { CreateUserDto };
