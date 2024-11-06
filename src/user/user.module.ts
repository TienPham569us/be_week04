import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userProvider } from './providers/user.provider';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '10d' },
      secret: process.env.JWT_SECRET_KEY
    }),
  ],
  controllers: [UserController],
  providers: [UserService, ...userProvider],
  exports: [UserService]
})
export class UserModule {}
