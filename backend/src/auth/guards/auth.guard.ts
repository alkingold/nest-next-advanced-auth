import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException('Unauthorized: User not authenticated');
    }

    const user = await this.userService.findById(request.session.userId);

    request.user = user;

    return true;
  }
}
