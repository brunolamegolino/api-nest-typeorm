import { NotFoundException } from '@nestjs/common';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { DataSource, Equal, Repository } from 'typeorm';

export class GetResourceUseCase {
  resourceRepository: Repository<Resource>;

  constructor(private readonly database: DataSource) {
    this.resourceRepository = this.database.getRepository(Resource.name);
  }

  public async execute(data: any): Promise<Resource> {
    const recurso = await this.resourceRepository.findOneBy({
      name: Equal(data.resource),
    });

    if (!recurso) {
      throw new NotFoundException('Recurso não encontrado!');
    }

    return recurso;
  }
}
