import { Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { USER_REPOSITORY } from '../providers';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly jwtService: JwtService
  ) {}

  public async create(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    return await this.userRepository.create<User>({
      ...userDto,
      password: hashedPassword
    });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  public async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  public async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  public async checkCredentials(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.findOneByEmail(loginUserDto.email);

    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      return user;
    }

    return null;
  }

  public async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, id: user.id, username: user.username };

    return await this.jwtService.signAsync(payload);
  }

  public async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY
    });
  }
}
