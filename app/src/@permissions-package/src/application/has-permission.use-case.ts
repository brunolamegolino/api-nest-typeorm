import { Permission } from '@permissions-package/domain/permission.entity';
import { DataSource, Repository, In } from 'typeorm';
import { DtoHasPermission } from './has-permission.dto';
import { UnauthorizedException } from '@nestjs/common';

export class HasPermissionUseCase {
  permissionRepository: Repository<Permission>;

  constructor(private readonly database: DataSource) {
    this.permissionRepository = this.database.getRepository(Permission.name);
  }

  public async execute(data: DtoHasPermission): Promise<Error | boolean> {
    const dto = await DtoHasPermission.create<DtoHasPermission>(data);

    const permissions = await this.permissionRepository.findBy({
      account_id: dto.account_id,
      group: In(dto.groups.map((g) => g.id)),
      action: dto.action,
      recurso_id: dto.recurso_id,
    });

    if (permissions.length === 0) {
      throw new UnauthorizedException(
        'Sem permissão para o recurso informado!',
      );
    }

    return true;
  }
}
