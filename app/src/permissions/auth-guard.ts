import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Group } from '@permissions-package/domain/group.entity';

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
      const token = this.extractTokenFromHeader(request.headers);
      const payload = await this.jwtService.verifyAsync(token);

      request.user = payload.user;
      request.account_id = request.headers?.account_id || '';
      request.role = request?.role || '';
    } catch {
      throw new UnauthorizedException('Credenciais inválidas!');
    }
    return true;
  }

  private extractTokenFromHeader(headers: any): any {
    const token = headers?.access_token.split(' ') ?? [];
    return token[0] === 'Bearer' ? token[1] : undefined;
  }

  async signIn(email: string, pass: string): Promise<{ user: User; access_token: string; permissions: Array<Group> }> {
    const user = await this.userRepository.findOne({
      where: { email: Equal(email) },
      relations: ['groups', 'groups.account'],
    });

    if (!user || !(await bcrypt.compare(pass, user.pass))) {
      throw new UnauthorizedException();
    }

    delete user.pass;
    return {
      user: user,
      access_token: await this.jwtService.signAsync({ user }, { expiresIn: '12h' }),
      permissions: user.groups,
    };
  }

  async signUp(email: string, pass: string): Promise<{ user: User; access_token: string }> {
    const user = await User.create<User>({ email: email, pass: await bcrypt.hashSync(pass, 10) });

    await this.userRepository.save(user);

    return await this.signIn(email, pass);
  }
}
