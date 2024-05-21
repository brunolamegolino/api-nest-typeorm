import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HasResources } from '@permissions-package/application/has-resources';
import { ControllerInteceptor } from './controller.interceptor';

@UseInterceptors(ControllerInteceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(readonly hasResources: HasResources) {}

  @Get()
  public getPermissions(): string {
    return this.hasResources.execute('empresas');
  }
}
