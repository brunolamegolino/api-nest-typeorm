import { DataSource, Equal, Repository } from 'typeorm';
import { Permission } from '@permissions-package/domain/permission.entity';
import { GetPermissionsDto } from './get-permissions.dto';
import { UnauthorizedException } from '@nestjs/common';

export class GetPermissionsUsecase {
  permissionRepository: Repository<Permission>;
  constructor(private readonly database: DataSource) {
    this.permissionRepository = this.database.getRepository(Permission.name);
  }

  public async execute(data: GetPermissionsDto): Promise<Array<Permission>> {
    // const dto = await GetPermissionsDto.create<GetPermissionsDto>(data);
    const dto: any = data;
    const permissions = await this.permissionRepository.findBy({
      account_user: {
        id: Equal(dto.account_user.id),
        account: Equal(dto.account.id),
      },
    });

    if (permissions.length === 0) {
      throw new UnauthorizedException('Sem permissão para o recurso informado!');
    }

    return permissions;
  }
}
