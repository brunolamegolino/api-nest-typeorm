import { Account } from '@permissions-package/domain/account.entity';
import { Group } from '@permissions-package/domain/group.entity';
import { GroupUser } from '@permissions-package/domain/groupUser.entity';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Equal, In, Repository } from 'typeorm';

export class GetGroupsUsecase {
  grupoRepository: Repository<Group>;
  grupoUserRepository: Repository<GroupUser>;

  constructor(private readonly database: DataSource) {
    this.grupoRepository = this.database.getRepository(Group.name);
    this.grupoUserRepository = this.database.getRepository(GroupUser.name);
  }

  public async execute(data: any): Promise<Array<Group>> {
    const dto: { user: User; account: Account } = data;
    const groupUser = await this.grupoUserRepository.findBy({
      user_id: Equal(dto.user.id),
    });

    const groups = await this.grupoRepository.find({
      where: {
        account: Equal(dto.account.id),
        id: In(groupUser.map((g) => g.group_id)),
      },
      relations: ['permissions'],
    });

    return groups;
  }
}
