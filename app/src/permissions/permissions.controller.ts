import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { Permission } from '@permissions-package/domain/permission.entity';

interface UseCase {
  execute(...variables: any): any;
}

@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    @Inject('GetPermissionsUsecase') readonly GetPermissionsUsecase: UseCase,
    @Inject('HasPermissionUseCase') readonly HasPermissionUseCase: UseCase,
    @Inject('GetGroupsUsecase') readonly GetGroupsUsecase: UseCase,
  ) {}

  @Get()
  public async getPermissions(accontId: string): Promise<Array<Permission>> {
    // ==> pegar todas as permissões de uma conta
    // usuario logado
    // usuario com ultimo token
    // => usuario logado

    const usuarioId = 1
    const groups = await this.GetGroupsUsecase.execute({
      account_id: accontId,
      user_id: usuarioId,
    })// encontrar grupos referente a conta: cliente_id

    await this.HasPermissionUseCase.execute({
      account_id: accontId,
      groups: groups,
      action: 'read',
      recurso_id: '1',
    }); // em algum dos grupos tem permissoes de ler permissoes
    return await this.GetPermissionsUsecase.execute({ account_id: accontId }); // listar permissoes
  }
}
