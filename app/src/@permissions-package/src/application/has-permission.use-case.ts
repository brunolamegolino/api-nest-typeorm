import { Permission } from '@permissions-package/domain/permission.entity';
import { DataSource, Repository, Equal } from 'typeorm';
import { DtoHasPermission } from './has-permission.dto';
import { UnauthorizedException } from '@nestjs/common';

export class HasPermissionUseCase {
  permissionRepository: Repository<Permission>;

  constructor(private readonly database: DataSource) {
    this.permissionRepository = this.database.getRepository(Permission.name);
  }

  public async execute(data: any): Promise<true> {
    const dto = await DtoHasPermission.create<DtoHasPermission>(data);

    let resourceFilter = '';
    if (dto.permission.elements)
      resourceFilter =
        '(elements_filter IS NULL OR ' +
        `(elements_filter = 'include' AND elements like '%,${dto.permission.elements},%' ) OR ` +
        `(elements_filter = 'exclude' AND elements not like '%,${dto.permission.elements},%' )) `;
    const permissions = await this.permissionRepository
      .createQueryBuilder()
      .where(resourceFilter)
      .setFindOptions({
        where: {
          action: Equal(dto.permission.action),
          resource: dto.resource,
          account_user: dto.account_user,
        },
      })
      .getMany();

    if (permissions.length === 0) {
      throw new UnauthorizedException('Sem permissão para o recurso informado!');
    }

    return true;
  }
}
