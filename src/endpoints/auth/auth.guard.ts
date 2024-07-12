import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [bearer, accessToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    try {
      const decodedToken = this.jwtService.verify(accessToken);
      request.user = decodedToken;

      return true;
    } catch (_) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
