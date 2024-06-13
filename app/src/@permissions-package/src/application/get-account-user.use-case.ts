import { AccountUser } from '@permissions-package/domain/account-user.entity';
import { User } from '@permissions-package/domain/user.entity';
import { DataSource, Equal, Repository } from 'typeorm';

export class GetAccountUserUseCase {
  repository: Repository<AccountUser>;

  constructor(private readonly database: DataSource) {
    this.repository = this.database.getRepository(AccountUser.name);
  }

  public async execute(data: any): Promise<AccountUser> {
    const dto: { accountUser: AccountUser; user: User } = data;

    const account_user = await this.repository.findOneOrFail({
      where: {
        id: dto.accountUser.id,
        user: { id: Equal(dto.user.id) },
      },
      relations: ['account', 'permissions.resource'],
    });

    return account_user;
  }
}
