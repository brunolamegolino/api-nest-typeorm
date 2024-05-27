import { Permission } from '@permissions-package/domain/permission.entity';
import { DataSource, Repository, In } from 'typeorm';
import { DtoHasPermission } from './has-permission.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Group } from '@permissions-package/domain/group.entity';

export class HasPermissionUseCase {
  permissionRepository: Repository<Permission>;

  constructor(private readonly database: DataSource) {
    this.permissionRepository = this.database.getRepository(Permission.name);
  }

  public async execute(data: DtoHasPermission): Promise<true> {
    // const dto = await DtoHasPermission.create<DtoHasPermission>(data);
    const dto: any = data;

    let resourceFilter = '';
    if (dto.permission_element_id)
      resourceFilter =
        '(elements_filter IS NULL OR ' +
        `(elements_filter = 'include' AND elements like '%,${dto.permission_element_id},%' ) OR ` +
        `(elements_filter = 'exclude' AND elements not like '%,${dto.permission_element_id},%' )) `;
    const permissions = await this.permissionRepository
      .createQueryBuilder()
      .where(resourceFilter)
      .setFindOptions({
        where: {
          account_id: dto.account_id,
          group: In(dto.groups.map((g: Group) => g.id)),
          action: dto.action,
          recurso_id: dto.recurso_id,
        },
      })
      .getMany();

    if (permissions.length === 0) {
      throw new UnauthorizedException(
        'Sem permissão para o recurso informado!',
      );
    }

    return true;
  }
}
