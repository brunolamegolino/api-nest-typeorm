import { Account } from '@permissions-package/domain/account.entity';
import { Group } from '@permissions-package/domain/group.entity';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Equal, Repository } from 'typeorm';

export class GetGroupsUsecase {
  grupoRepository: Repository<Group>;

  constructor(private readonly database: DataSource) {
    this.grupoRepository = this.database.getRepository(Group.name);
  }

  public async execute(data: any): Promise<Array<Group>> {
    const dto: { user: User; account: Account } = data;

    const groups = await this.grupoRepository.find({
      where: {
        account: Equal(dto.account.id),
        users: {
          id: Equal(dto.user.id),
        },
      },
      relations: ['permissions'],
    });

    return groups;
  }
}
