import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { MembersService } from '../../members/members.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly membersService: MembersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.authService.decodeToken(token);
      const member = await this.membersService.findById(payload.sub);
      if (!member) {
        throw new UnauthorizedException('Member not found');
      }
      request.user = member;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
