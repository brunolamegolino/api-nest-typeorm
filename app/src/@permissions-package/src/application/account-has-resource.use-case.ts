import { NotFoundException } from '@nestjs/common';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { DataSource, Equal, Repository } from 'typeorm';

export class AccountHasResourceUseCase {
  resourceRepository: Repository<Resource>;

  constructor(private readonly database: DataSource) {
    this.resourceRepository = this.database.getRepository(Resource.name);
  }

  public async execute(data: any): Promise<true> {
    const dto: any = data;

    const resouce = await this.resourceRepository.findOne({
      where: {
        name: Equal(dto.resource.name),
        product: {
          account_products: {
            account: {
              id: Equal(dto.account.id),
            },
          },
        },
      },
    });

    if (!resouce) {
      throw new NotFoundException(`Conta não possui o produto!`);
    }

    return true;
  }
}
