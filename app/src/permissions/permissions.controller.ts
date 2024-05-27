/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Inject,
  Param,
  Request,
  UseInterceptors,
  All,
  UseGuards,
  Post,
  Body,
  RawBody,
} from '@nestjs/common';
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

@UseInterceptors(ControllerInteceptor)
@Controller('auth')
export class AuthController {
  constructor(@Inject('Database') readonly database: DataSource) {}

  @ApiBody({
    schema: {
      properties: { email: { type: 'string' }, pass: { type: 'string' } },
    },
  })
  @Post()
  async signIn(@Body() { email, pass }: any): Promise<any> {
    const authGuard = new AuthGuard(this.database);
    return authGuard.signIn(email, pass);
  }
}

@ApiHeader({ name: 'account-id' })
@UseGuards(AuthGuard)
@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    @Inject('GetPermissionsUsecase')
    readonly GetPermissionsUsecase: GetPermissionsUsecase,
    @Inject('HasPermissionUseCase')
    readonly HasPermissionUseCase: HasPermissionUseCase,
    @Inject('GetGroupsUsecase') readonly GetGroupsUsecase: GetGroupsUsecase,
  ) {}

  @Get('get-permissions/:accountId')
  public async getPermissions(
    @Param('accountId') accountId: string,
  ): Promise<Array<Group>> {
    // ==> pegar todas as permissões de uma conta
    // usuario logado
    // usuario com ultimo token
    // => usuario logado
    const data: any = { account_id: accountId };
    data.user_id = 1;

    data.groups = await this.GetGroupsUsecase.execute(data); // encontrar grupos referente a conta: cliente_id

    data.action = 'read';
    data.recurso_id = '1';
    await this.HasPermissionUseCase.execute(data); // em algum dos grupos tem permissoes de ler permissoes

    return data.groups;
  }
}

@ApiHeader({ name: 'account-id' })
@UseGuards(AuthGuard)
@UseInterceptors(ControllerInteceptor)
@Controller('')
export class ValidatorController {
  constructor(
    @Inject('RedirectUseCase') readonly RedirectUseCase: RedirectUseCase,
    @Inject('GetResourceUseCase')
    readonly GetResourceUseCase: GetResourceUseCase,
    @Inject('AccountHasResourceUseCase')
    readonly AccountHasResourceUseCase: AccountHasResourceUseCase,
    @Inject('GetGroupsUsecase') readonly GetGroupsUsecase: GetGroupsUsecase,
    @Inject('HasPermissionUseCase')
    readonly HasPermissionUseCase: HasPermissionUseCase,
  ) {}

  @All('*/:id')
  public async validator(
    @Request() request: any,
    @Param('id') permissionElementId: number,
  ) {
    const data: any = {
      user_id: 1,
      account_id: request.headers['account-id'],
      resource_name: request.url.split('/')[1],
      permission_element_id: permissionElementId,
    };

    await this.AccountHasResourceUseCase.execute(data);

    data.resource = await this.GetResourceUseCase.execute(data);

    data.groups = await this.GetGroupsUsecase.execute(data);

    await this.HasPermissionUseCase.execute(data);

    return await this.RedirectUseCase.execute({
      ...request,
      baseURL: data.resource.domain,
    });
  }
}
