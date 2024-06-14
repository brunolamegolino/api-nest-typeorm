import { Controller, Get, Inject, Param, Request, UseInterceptors, All, UseGuards, Post, Body, BadRequestException } from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { GetPermissionsUsecase } from '@permissions-package/application/get-permissions.use-case';
import { HasPermissionUseCase } from '@permissions-package/application/has-permission.use-case';
import { RedirectUseCase } from '@permissions-package/application/redirect.use-case';
import { GetResourceUseCase } from '@permissions-package/application/get-resource.use-case';
import { AccountHasResourceUseCase } from '@permissions-package/application/account-has-resource.use-case';
import { AuthGuard } from './auth-guard';
import { ApiBody, ApiHeader } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Account } from '@permissions-package/domain/account.entity';
import { Permission } from '@permissions-package/domain/permission.entity';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { GetAccountUseCase } from '@permissions-package/application/get-account.use-case';
import { GetAccountUserUseCase } from '@permissions-package/application/get-account-user.use-case';

@UseInterceptors(ControllerInteceptor)
@Controller('auth')
export class AuthController {
  authGuard: AuthGuard;

  constructor(
    @Inject('Database') readonly database: DataSource,
    @Inject('GetAccountUseCase') readonly GetAccountUseCase: GetAccountUseCase,
  ) {
    this.authGuard = new AuthGuard(this.database);
  }

  @ApiBody({ schema: { properties: { email: { type: 'string' }, pass: { type: 'string' } } } })
  @Post()
  async signIn(@Body() { email, pass }: any): Promise<any> {
    return { ...(await this.authGuard.signIn(email, pass)) };
  }

  @ApiBody({ schema: { properties: { email: { type: 'string' }, pass: { type: 'string' } } } })
  @Post('sign-up')
  async signUp(@Body() { email, pass }: any): Promise<any> {
    return await this.authGuard.signUp(email, pass);
  }
}

@ApiHeader({ name: 'account-id' })
@UseGuards(AuthGuard)
@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    @Inject('GetPermissionsUsecase') readonly GetPermissionsUsecase: GetPermissionsUsecase,
    @Inject('HasPermissionUseCase') readonly HasPermissionUseCase: HasPermissionUseCase,
    @Inject('GetResourceUseCase') readonly GetResourceUseCase: GetResourceUseCase,
    @Inject('GetAccountUserUseCase') readonly GetAccountUserUseCase: GetAccountUserUseCase,
    @Inject('GetAccountUseCase') readonly GetAccountUseCase: GetAccountUseCase,
  ) {}

  @Get(':accountId')
  public async getPermissions(@Request() { user, account_user_id }: any, @Param('accountId') accountId: string): Promise<Array<Permission>> {
    const data: any = {};
    data.user = user;
    data.resource = await Resource.create<Partial<Resource>>({ name: 'permissions' });
    data.permission = await Permission.create<Partial<Permission>>({ action: 'read' });
    data.account_user = await this.GetAccountUserUseCase.execute({ accountUser: { id: account_user_id }, user: data.user });
    data.account = await this.GetAccountUseCase.execute(data.account_user);

    if (data.account.id != accountId) throw new BadRequestException('Conta informada não corresponde a conta exgida!');

    data.resource = await this.GetResourceUseCase.execute(data);

    await this.HasPermissionUseCase.execute(data); // em algum dos grupos tem permissoes de ler permissoes

    data.permissions = await this.GetPermissionsUsecase.execute(data);

    return data.permissions;
  }
}

@UseGuards(AuthGuard)
@UseInterceptors(ControllerInteceptor)
@Controller('')
export class ValidatorController {
  constructor(
    @Inject('RedirectUseCase') readonly RedirectUseCase: RedirectUseCase,
    @Inject('GetResourceUseCase') readonly GetResourceUseCase: GetResourceUseCase,
    @Inject('AccountHasResourceUseCase') readonly AccountHasResourceUseCase: AccountHasResourceUseCase,
    @Inject('HasPermissionUseCase') readonly HasPermissionUseCase: HasPermissionUseCase,
    @Inject('GetAccountUseCase') readonly GetAccountUseCase: GetAccountUseCase,
    @Inject('GetAccountUserUseCase') readonly GetAccountUserUseCase: GetAccountUserUseCase,
  ) {}

  private getActionFromMethod(method: string): string {
    if ('GET' === method) return 'read';
    if ('DELETE' === method) return 'delete';
    if ('POST' === method) return 'create';
    if (['PUT', 'PATCH'].includes(method)) return 'update';
    throw new BadRequestException();
  }

  @All('*')
  public async validator(@Request() request: any): Promise<any> {
    const paths = request.url.split('/');
    const data: any = {};
    data.user = request.user;
    data.resource = await Resource.create<Partial<Resource>>({ name: paths[1] });
    data.account_user = await this.GetAccountUserUseCase.execute({ accountUser: { id: request.account_user_id }, user: data.user });
    data.account = await this.GetAccountUseCase.execute(data.account_user);
    data.permission = await Permission.create<Partial<Permission>>({ action: this.getActionFromMethod(request.method) });
    data.products = {};
    const products: any = {};
    for (const account_product of data.account.account_products) {
      products[account_product.product.name] = { ...account_product.product, limit: account_product.limit };
    }

    await this.AccountHasResourceUseCase.execute(data);

    data.resource = await this.GetResourceUseCase.execute(data);

    await this.HasPermissionUseCase.execute(data);

    request.baseURL = data.resource.domain;
    request.headers = {
      ...request.headers,
      user: JSON.stringify(data.user),
      account: JSON.stringify(data.account),
      products: JSON.stringify(products),
      permissions: JSON.stringify(data.account_user.permissions),
    };
    return await this.RedirectUseCase.execute(request);
  }
}
