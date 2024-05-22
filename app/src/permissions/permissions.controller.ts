import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { ControllerInteceptor } from './controller.interceptor';
import { HasResources } from '@permissions-package/application/has-resources';
import { GetPermissions } from '@permissions-package/application/get-permissions';
import { Permission } from '@permissions-package/domain/permission.entity';

@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    @Inject('GetPermissions')readonly GetPermissions: GetPermissions,
    @Inject('HasResources')readonly hasResources: HasResources,
  ) {}

  @Get()
  public async getPermissions(): Promise<Array<Permission>> {
    // ==> pegar todas as permissões de uma conta
    // usuario logado
    // usuario com ultimo token
    // => usuario logado
    // encontrar grupos referente a conta: cliente_id
    // em algum dos grupos tem permissoes de ler permissoes
    // listar permissoes
    return await this.GetPermissions.execute('empresas');
  }
}
