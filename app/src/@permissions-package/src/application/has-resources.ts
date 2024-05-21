import { DataSource, Repository } from "typeorm";

export class HasResources {

  constructor(private readonly database: DataSource) {
  }

  public execute(resources: string): any {
    return resources;
  }
}
