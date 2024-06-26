import { Account } from '@permissions-package/domain/account.entity';
import { DataSource, Equal, Repository } from 'typeorm';

export class GetAccountUseCase {
  accountRepository: Repository<Account>;

  constructor(private readonly database: DataSource) {
    this.accountRepository = this.database.getRepository(Account.name);
  }

  public async execute(data: any): Promise<Account> {
    const dto: { account: Account } = data;

    const account = await this.accountRepository.findOneOrFail({
      where: { id: Equal(dto.account.id) },
      relations: ['account_products.product'],
    });

    return account;
  }
}
