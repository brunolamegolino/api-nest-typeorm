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
  });

  it('should be defined', async () => {
    expect(permissionsController).toBeDefined();
    expect(validatorController).toBeDefined();
  });

  it('should get permissions', async () => {
    const account = await database.manager.save<Account>(await Account.create<Account>({}, true));

    const group = await database.manager.save<Group>(
      await Group.create<Group>(
        {
          account: account,
          name: 'grupo 1',
        },
        true,
      ),
    );

    const user = await database.manager.save<User>(
      await User.create<User>(
        {
          email: 'email',
          pass: 'pass',
          groups: [group],
        },
        true,
      ),
    );

    const resource = await database.manager.save<Resource>(
      await Resource.create<Resource>(
        {
          product: null,
          domain: '172.0.0.1:3000',
          name: 'permissions',
        },
        true,
      ),
    );

    await database.manager.save<Permission>(
      await Permission.create<Permission>(
        {
          account: account,
          group: group,
          action: 'read',
          resource: resource,
        },
        true,
      ),
    );

    const groups = await permissionsController.getPermissions({ user }, account.id);
    expect(groups[0]).toBeInstanceOf(Group);
    expect(groups[0].permissions).toBeInstanceOf(Array);
    expect(groups[0].permissions[0]).toBeInstanceOf(Permission);
  });

  // it('validate permission before to redirect', async () => {
  //   const group = await database.manager.save(
  //     await Group.create({
  //       id: '1',
  //       account_id: '1',
  //       name: 'grupo 1',
  //     }),
  //   );

  //   const permission = await Permission.create(
  //     {
  //       account_id: '1',
  //       group: group,
  //       action: 'read',
  //       recurso_id: '1',
  //       elements: ',1,',
  //       elements_filter: 'include',
  //     },
  //     true,
  //   );

  //   await database.manager.save(permission);

  //   await database.manager.save(
  //     await GroupUser.create(
  //       {
  //         group_id: '1',
  //         user_id: '1',
  //       },
  //       true,
  //     ),
  //   );

  //   const product = await database.manager.save(
  //     await Product.create<Product>(
  //       {
  //         name: 'Assinatura',
  //       },
  //       true,
  //     ),
  //   );

  //   await database.manager.save(
  //     await Resource.create<Resource>(
  //       {
  //         name: 'empresa',
  //         product: product,
  //         domain: '127.0.0.1',
  //       },
  //       true,
  //     ),
  //   );

  //   const account = await database.manager.save(
  //     await Account.create<Account>({}, true),
  //   );
  //   await database.manager.save(
  //     await Plan.create<Plan>(
  //       {
  //         account: account,
  //         products: [product],
  //       },
  //       true,
  //     ),
  //   );

  //   const redirect = await validatorController.validator(
  //     {
  //       ,
  //       url: '/empresa/1',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'account-id': 1,
  //       },
  //       body: {
  //         account_id: '1',
  //       },
  //     },
  //     1,
  //   );
  //   expect(true).toBe(true);
  // });
});
