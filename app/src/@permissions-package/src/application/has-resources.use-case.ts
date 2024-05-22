import { DataSource, Repository } from "typeorm";

export class HasResourcesUseCase {

  constructor(private readonly database: DataSource) {
  }

  public execute(resources: string): any {
    return resources;
  }
}
