import { validateOrReject } from 'class-validator';

export class Base {
  public static async create<T>(data: Partial<T>, removeId = false): Promise<T> {
    const entity = new this() as T & { id: string };

    for (const key in entity) {
      if (key in data) entity[key] = data[key];
      else delete entity[key];
    }

    await validateOrReject(entity);
    if (removeId && 'id' in entity) delete entity.id;
    return entity as T;
  }
}
