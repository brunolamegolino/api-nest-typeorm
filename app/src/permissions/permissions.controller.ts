/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Inject,
  Param,
  Request,
  UseInterceptors,
  All,
} from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { Group } from '@permissions-package/domain/group.entity';
import { GetPermissionsUsecase } from '@permissions-package/application/get-permissions.use-case';
import { HasPermissionUseCase } from '@permissions-package/application/has-permission.use-case';
import { GetGroupsUsecase } from '@permissions-package/application/get-groups.use-case';
import { RedirectUseCase } from '@permissions-package/application/redirect.use-case';
import { group } from 'console';

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

// user -> login
// email senha -> login -> retorna token e permissões

// user -> lista de empresas
// token -> Get gateway/empresa -> tem permissão -> Get dominio/empresa

// user -> comunicacao da empresa
// token -> Get gateway/comunicacao -> tem permissão comunicacao -> tem permissao para essa empresa -> Get dominio/comunicacao
@UseInterceptors(ControllerInteceptor)
@Controller('')
export class ValidatorController {
  constructor(
    @Inject('RedirectUseCase') readonly RedirectUseCase: RedirectUseCase,
  ) {}

  @All('*')
  public async validator(@Request() request: Request) {
    console.log('validator');

    return await this.RedirectUseCase.execute({
      ...request,
      baseURL: 'http://localhost:3000',
    });
  }
}
