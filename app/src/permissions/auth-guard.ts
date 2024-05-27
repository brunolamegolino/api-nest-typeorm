import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  jwtService: JwtService;
  userRepository: Repository<User>;

  constructor(@Inject('Database') readonly database: DataSource) {
    this.jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    this.userRepository = database.getRepository(User.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (isPublic) {
    //   // 💡 See this condition
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): any {
    const token = request.headers['account-id']?.split(' ') ?? [];
    return token === 'Bearer' ? token : undefined;
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ user: User; access_token: string }> {
    const user = await this.userRepository.findOneBy({ email, pass });
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      user: user,
      access_token: await this.jwtService.signAsync(
        { user },
        { expiresIn: '5m' },
      ),
    };
  }
}
