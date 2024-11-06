import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/services/user.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    const userExist = await this.userService.findOneByEmail(request.body.email);
    if (userExist) {
      return true;
    }

    throw new ForbiddenException("This user doesn't exist");
  }
}
