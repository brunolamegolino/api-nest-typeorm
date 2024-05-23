import {
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { Group } from '@permissions-package/domain/group.entity';
import { GetPermissionsUsecase } from '@permissions-package/application/get-permissions.use-case';
import { HasPermissionUseCase } from '@permissions-package/application/has-permission.use-case';
import { GetGroupsUsecase } from '@permissions-package/application/get-groups.use-case';

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

  @Get('get-permissions/:accontId')
  public async getPermissions(
    @Param('accontId') accontId: string,
  ): Promise<Array<Group>> {
    // ==> pegar todas as permissões de uma conta
    // usuario logado
    // usuario com ultimo token
    // => usuario logado

    const userId = 1;
    const groups = await this.GetGroupsUsecase.execute({
      account_id: accontId,
      user_id: userId,
    }); // encontrar grupos referente a conta: cliente_id

    await this.HasPermissionUseCase.execute({
      account_id: accontId,
      groups: groups,
      action: 'read',
      recurso_id: '1',
    }); // em algum dos grupos tem permissoes de ler permissoes

    return groups;
  }
}
