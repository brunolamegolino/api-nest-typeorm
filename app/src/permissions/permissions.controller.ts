import { Controller, Get, Inject, Param, Request, UseInterceptors, All, UseGuards, Post, Body, BadRequestException } from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { Group } from '@permissions-package/domain/group.entity';
import { GetPermissionsUsecase } from '@permissions-package/application/get-permissions.use-case';
import { HasPermissionUseCase } from '@permissions-package/application/has-permission.use-case';
import { GetGroupsUsecase } from '@permissions-package/application/get-groups.use-case';
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
    return { ...(await this.authGuard.signIn(email, pass)), account: await this.GetAccountUseCase.execute({ account: { id: 'ef28251f-b0a8-425c-9636-6a7e1f08bee9' } }) };
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
    @Inject('GetGroupsUsecase') readonly GetGroupsUsecase: GetGroupsUsecase,
    @Inject('GetResourceUseCase') readonly GetResourceUseCase: GetResourceUseCase,
  ) {}

  @Get(':accountId')
  public async getPermissions(@Request() { user }: any, @Param('accountId') accountId: string): Promise<Array<Group>> {
    const data: any = {
      account: await Account.create<Partial<Account>>({ id: accountId }),
      user: user,
      resource: await Resource.create<Partial<Resource>>({ name: 'permissions' }),
      permission: await Permission.create<Partial<Permission>>({ action: 'read' }),
    };

    data.groups = await this.GetGroupsUsecase.execute(data); // encontrar grupos referente a conta: cliente_id

    data.resource = await this.GetResourceUseCase.execute(data);

    await this.HasPermissionUseCase.execute(data); // em algum dos grupos tem permissoes de ler permissoes

    return data.groups;
  }
}

@ApiHeader({ name: 'account_id' })
@ApiHeader({ name: 'access_token' })
@UseGuards(AuthGuard)
@UseInterceptors(ControllerInteceptor)
@Controller('')
export class ValidatorController {
  constructor(
    @Inject('RedirectUseCase') readonly RedirectUseCase: RedirectUseCase,
    @Inject('GetResourceUseCase') readonly GetResourceUseCase: GetResourceUseCase,
    @Inject('AccountHasResourceUseCase') readonly AccountHasResourceUseCase: AccountHasResourceUseCase,
    @Inject('GetGroupsUsecase') readonly GetGroupsUsecase: GetGroupsUsecase,
    @Inject('HasPermissionUseCase') readonly HasPermissionUseCase: HasPermissionUseCase,
    @Inject('GetAccountUseCase') readonly GetAccountUseCase: GetAccountUseCase,
  ) {}

  private getActionFromMethod(method: string): string {
    if ('GET' === method) return 'read';
    if ('DELETE' === method) return 'delete';
    if ('POST' === method) return 'create';
    if (['PUT', 'PATCH'].includes(method)) return 'update';
    throw new BadRequestException();
  }

  @All('*')
  public async validator(@Request() request: any, @Body() body: any): Promise<any> {
    const paths = request.url.split('/');
    const data: any = {};
    data.user = request.user;
    data.account = await this.GetAccountUseCase.execute({ account: { id: JSON.parse(request.headers.account).id } });
    data.resource = await Resource.create<Partial<Resource>>({ name: paths[1] });
    data.permission = await Permission.create<Partial<Permission>>({
      action: this.getActionFromMethod(request.method), // elements: elementeId,
    });

    await this.AccountHasResourceUseCase.execute(data);

    data.resource = await this.GetResourceUseCase.execute(data);

    data.groups = await this.GetGroupsUsecase.execute(data);

    await this.HasPermissionUseCase.execute(data);

    return await this.RedirectUseCase.execute({
      ...request,
      headers: {
        ...request.headers,
        // user: JSON.stringify(data.user),
        // account: JSON.stringify(data.account),
        // permissions: JSON.stringify(data.groups),
      },
      baseURL: data.resource.domain,
    });
  }
}
