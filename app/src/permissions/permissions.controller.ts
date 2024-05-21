import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { HasResources } from '@permissions-package/application/has-resources';
import { ControllerInteceptor } from './controller.interceptor';

@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(@Inject('HasResources')readonly hasResources: HasResources) {}

  @Get()
  public getPermissions(): string {
    return this.hasResources.execute('empresas');
  }
}
