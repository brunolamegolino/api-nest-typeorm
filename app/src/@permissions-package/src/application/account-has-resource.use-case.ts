import { NotFoundException } from '@nestjs/common';
import { Account } from '@permissions-package/domain/account.entity';
import { DataSource, Equal, Repository } from 'typeorm';

export class AccountHasResourceUseCase {
  accountRepository: Repository<Account>;

  constructor(private readonly database: DataSource) {
    this.accountRepository = this.database.getRepository(Account.name);
  }

  public async execute(data: any): Promise<Error | true> {
    const resouce = await this.accountRepository.findOne({
      where: {
        // name: Equal(data.resource),
        id: Equal(data.account_id),
      },
      relations: ['plans', 'plans.products', 'plans.products.resources'],
      loadEagerRelations: false,
    });

    if (!resouce) {
      throw new NotFoundException('Recurso não encontrado!');
    }

    return true;
  }
}
