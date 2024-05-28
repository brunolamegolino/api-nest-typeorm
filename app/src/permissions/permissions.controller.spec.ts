import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { PermissionsController, ValidatorController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';
import { Permission } from '@permissions-package/domain/permission.entity';
import { Group } from '@permissions-package/domain/group.entity';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { Product } from '@permissions-package/domain/product.entity';
import { Account } from '@permissions-package/domain/account.entity';
import { Plan } from '@permissions-package/domain/plan.entity';
import { User } from '@permissions-package/domain/user.entity';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;
  let validatorController: ValidatorController;
  let database: DataSource;

  let account: Account;
  let group: Group;
  let user: User;
  let resource: Resource;
  let permission: Permission;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController, ValidatorController],
      providers: [...PermissionsProvider],
    }).compile();

    permissionsController = module.get<PermissionsController>(PermissionsController);
    validatorController = module.get<ValidatorController>(ValidatorController);
    database = module.get<DataSource>('Database');
    for (const entity of database.entityMetadatas) {
      await database.getRepository(entity.name).delete({});
      // const queryRunner = database.createQueryRunner();
      // await queryRunner.query(`ALTER SEQUENCE ${seq} RESTART WITH 1`);
      // await queryRunner.release();
    }

    account = await database.manager.save<Account>(await Account.create<Account>({}));
    group = await database.manager.save<Group>(await Group.create<Group>({ account: account, name: 'grupo 1' }));
    user = await database.manager.save<User>(await User.create<User>({ email: 'email', pass: 'pass', groups: [group] }));
    resource = await database.manager.save<Resource>(await Resource.create<Resource>({ product: null, domain: '172.0.0.1:3000', name: 'permissions' }));
    permission = await database.manager.save<Permission>(await Permission.create<Permission>({ account: account, group: group, action: 'read', resource: resource }));

    const product = await database.manager.save(await Product.create<Product>({ name: 'Assinatura' }));
    const resource2 = await database.manager.save<Resource>(await Resource.create<Resource>({ product, domain: '172.0.0.1:3000', name: 'empresa' }, true));
    await database.manager.save(await Plan.create<Plan>({ account, products: [product] }));
    await database.manager.save<Permission>(await Permission.create<Permission>({ account, group, action: 'read', resource: resource2 }, true));
  });

  it('should get permissions', async () => {
    expect(permission).toBeInstanceOf(Permission);

    const groups = await permissionsController.getPermissions({ user }, account.id);
    expect(groups[0]).toBeInstanceOf(Group);
    expect(groups[0].permissions).toBeInstanceOf(Array);
    expect(groups[0].permissions[0]).toBeInstanceOf(Permission);
  });

  it('validate permission before to redirect', async () => {
    const redirect = await validatorController.validator({ user, method: 'GET', url: `/empresa/1`, headers: { 'Content-Type': 'application/json', 'account-id': account.id } }, undefined, undefined);
    expect(true).toBe(true);
  });
});
