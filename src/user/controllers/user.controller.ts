import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
  ValidationPipe,
  Request
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { LoginUserDto } from '../dtos/login-user.dto';
import { DoesUserExist } from 'src/guards/doesUserExist.guard';
import { UserAuthenticateGuard } from 'src/guards/UserAuthenticate.guard';

const transformError = (error: ValidationError) => {
  const { property, constraints } = error;
  return {
    property,
    constraints
  };
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(DoesUserExist)
  @Post('register')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const data = {
        mode: 'create'
      };

      // validation
      const object = plainToInstance(CreateUserDto, createUserDto);
      const errors = await validate(object, {
        stopAtFirstError: true
      });

      console.log('errors: ', errors);

      if (errors.length > 0) {
        console.log('errors: ', errors);
        Reflect.set(data, 'error', 'Please correct all fields!');
        const responseError = {};
        errors.map((error) => {
          const rawError = transformError(error);
          Reflect.set(responseError, rawError.property, Object.values(rawError.constraints)[0]);
        });
        Reflect.set(data, 'errors', responseError);
        return { data };
      }

      const userExist = await this.userService.findOneByEmail(createUserDto.email);
      if (userExist) {
        throw new ForbiddenException('This email already exist');
        return;
      }

      const usernameExist = await this.userService.findOneByUsername(createUserDto.username);
      if (usernameExist) {
        throw new ForbiddenException('This username already exist');
        return;
      }

      // set value and show success message
      Reflect.set(data, 'email', object.email);
      Reflect.set(data, 'username', object.username);
      //console.log('data1: ', data);
      const user = await this.userService.create({ ...object });

      Reflect.set(data, 'success', `Account ${user.email} - has been created successfully!`);
      //console.log('data2: ', data);
      return { data };
      //return this.userService.createUser({ ...object });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.log('error: ', error);
      throw new InternalServerErrorException('Server error! Please try again later...');
    }
  }

  //@UseGuards(DoesUserExist)
  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    try {
      const data = {
        mode: 'login'
      };
      // validation
      const object = plainToInstance(LoginUserDto, loginUserDto);
      const errors = await validate(object, {
        stopAtFirstError: true
      });

      console.log('errors: ', errors);

      if (errors.length > 0) {
        console.log('errors: ', errors);
        Reflect.set(data, 'error', 'Please correct all fields!');
        const responseError = {};
        errors.map((error) => {
          const rawError = transformError(error);
          Reflect.set(responseError, rawError.property, Object.values(rawError.constraints)[0]);
        });
        Reflect.set(data, 'errors', responseError);
        return { data };
      }

      const checkEmail = await this.userService.findOneByEmail(loginUserDto.email);
      if (!checkEmail) {
        throw new ForbiddenException("This user doesn't existed.");
      }
      const user = await this.userService.checkCredentials(loginUserDto);
      if (!user) {
        throw new ForbiddenException('Invalid credentials! Please check your email and password.');
      }

      const token: string = await this.userService.generateToken(user);

      Reflect.set(data, 'access_token', token);
      return { access_token: token, email: user.email, id: user.id, username: user.username };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Server error! Please try again later...');
    }
  }

  @UseGuards(UserAuthenticateGuard)
  @Get('profile')
  async profile(@Request() req) {
    return { message: 'success', ...req.user };
  }
}
