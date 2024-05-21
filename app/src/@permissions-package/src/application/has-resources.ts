export class HasResources {
  constructor(private readonly database: any) {}

  public execute(resources: string): any {
    console.log(this.database);
    return resources;
  }
}
