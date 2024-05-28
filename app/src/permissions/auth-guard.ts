import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload.user;
      request.account_id = request?.account_id || '';
      request.role = request?.role || '';
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): any {
    const token = request.headers['acess_token']?.split(' ') ?? [];
    return token[0] === 'Bearer' ? token[1] : undefined;
  }

  async signIn(email: string, pass: string): Promise<{ user: User; access_token: string }> {
    const user = await this.userRepository.findOneBy({
      email: Equal(email),
    });

    if (!user || !(await bcrypt.compare(pass, user.pass))) {
      throw new UnauthorizedException();
    }

    delete user.pass;
    return {
      user: user,
      access_token: await this.jwtService.signAsync({ user }, { expiresIn: '5m' }),
    };
  }

  async signUp(email: string, pass: string): Promise<{ user: User; access_token: string }> {
    const user = await User.create<User>({ email: email, pass: await bcrypt.hashSync(pass, 10) });

    try {
      await this.userRepository.save(user);
    } catch (error: any) {
      if (error?.detail) throw new BadRequestException(error.detail);
      throw error;
    }

    return await this.signIn(email, pass);
  }
}
