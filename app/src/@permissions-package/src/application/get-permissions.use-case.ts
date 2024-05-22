import { DataSource, Repository } from "typeorm";
import { Permission } from "@permissions-package/domain/permission.entity";

export class GetPermissionsUsecase {
  permissionRepository: Repository<Permission>;
  constructor(private readonly database: DataSource) {
    this.permissionRepository = this.database.getRepository(Permission.name);
  }

  public async execute(accontId: string): Promise<Array<Permission>> {
    return await this.permissionRepository.findBy({
      account_id: accontId
    });
  }
}
