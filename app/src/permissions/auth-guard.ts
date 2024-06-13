import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountUser } from '@permissions-package/domain/account-user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  jwtService: JwtService;
  userRepository: Repository<User>;

  constructor(@Inject('Database') readonly database: DataSource) {
    this.jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'secret' });
    this.userRepository = database.getRepository(User.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { access_token, account_user_id } = request.headers;
    let payload: any = '';

    try {
      payload = await this.jwtService.verifyAsync(access_token);
    } catch {
      throw new UnauthorizedException('Credenciais inválidas!');
    }

    if (!payload.user || !account_user_id) throw new BadRequestException('Credenciais inválidas!');

    request.user = payload.user;
    request.account_user_id = account_user_id;
    return true;
  }

  async signIn(email: string, pass: string): Promise<{ user: User; access_token: string; account_users: Array<AccountUser> }> {
    const user = await this.userRepository.findOne({
      where: { email: Equal(email) },
      relations: ['account_user.account', 'account_user.permissions.resource'],
      order: { account_user: { account: { id: 'ASC' }, role: 'ASC' } },
    });

    if (!user || !(await bcrypt.compare(pass, user.pass))) {
      throw new UnauthorizedException();
    }

    const account_users = user.account_user;
    delete user.pass;
    delete user.account_user;
    return {
      user,
      access_token: await this.jwtService.signAsync({ user }, { expiresIn: '12h' }),
      account_users,
    };
  }

  async signUp(email: string, pass: string): Promise<{ user: User; access_token: string }> {
    const user = await User.create<User>({ email: email, pass: await bcrypt.hashSync(pass, 10) });

    await this.userRepository.save(user);

    return await this.signIn(email, pass);
  }
}
