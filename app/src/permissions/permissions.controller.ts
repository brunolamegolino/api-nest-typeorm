import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { Permission } from '@permissions-package/domain/permission.entity';

@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    @Inject('GetPermissionsUsecase')readonly GetPermissionsUsecase: any,
    // @Inject('HasResources')readonly hasResources: HasResources,
    // @Inject('HasPermission')readonly hasResources: HasResources,
  ) {}

  @Get()
  public async getPermissions(accontId: string): Promise<Array<Permission>> {
    // ==> pegar todas as permissões de uma conta
    // usuario logado
    // usuario com ultimo token
    // => usuario logado
    // encontrar grupos referente a conta: cliente_id
    // await this.hasPermission.execute(accontId); // em algum dos grupos tem permissoes de ler permissoes
    return await this.GetPermissionsUsecase.execute(accontId); // listar permissoes
  }
}
