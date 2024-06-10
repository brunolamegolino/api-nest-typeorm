import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AuthController, PermissionsController, ValidatorController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';
import { Permission } from '@permissions-package/domain/permission.entity';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { Product } from '@permissions-package/domain/product.entity';
import { Account } from '@permissions-package/domain/account.entity';
import { Plan } from '@permissions-package/domain/plan.entity';
import { User } from '@permissions-package/domain/user.entity';
import { AccountUser } from '@permissions-package/domain/account-user.entity';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;
  let validatorController: ValidatorController;
  let authController: AuthController;
  let database: DataSource;

  let account: Account;
  let user: User;
  let resource: Resource;
  let permission: Permission;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController, ValidatorController, AuthController],
      providers: [...PermissionsProvider],
    }).compile();

    permissionsController = module.get<PermissionsController>(PermissionsController);
    validatorController = module.get<ValidatorController>(ValidatorController);
    authController = module.get<AuthController>(AuthController);
    database = module.get<DataSource>('Database');
    for (const entity of database.entityMetadatas) {
      await database.getRepository(entity.name).delete({});
      // const queryRunner = database.createQueryRunner();
      // await queryRunner.query(`ALTER SEQUENCE ${seq} RESTART WITH 1`);
      // await queryRunner.release();
    }

    account = await database.manager.save<Account>(await Account.create<Account>({}));
    user = await database.manager.save<User>(await User.create<User>({ email: 'email', pass: '$2b$10$cNvm1xMSP9JFiRms50XCceU77p.gEuBXGK.NzZ.41Q7LpJJex6z86' }));
    const account_user = await database.manager.save<AccountUser>(await AccountUser.create<AccountUser>({ account, user, role: 'admin' }));
    resource = await database.manager.save<Resource>(await Resource.create<Resource>({ product: null, domain: '172.0.0.1:3000', name: 'permissions' }));
    permission = await database.manager.save<Permission>(await Permission.create<Permission>({ account_user, action: 'read', resource: resource }));

    const product = await database.manager.save(await Product.create<Product>({ name: 'Assinatura' }));
    const resource2 = await database.manager.save<Resource>(await Resource.create<Resource>({ product, domain: '172.0.0.1:3000', name: 'empresa' }, true));
    await database.manager.save(await Plan.create<Plan>({ account, products: [product] }));
    await database.manager.save<Permission>(await Permission.create<Permission>({ account_user, action: 'read', resource: resource2 }, true));
  });

  it('should can login', async () => {
    const login = await authController.signIn({ email: 'email', pass: 'pass' });

    expect(login.access_token).toBeDefined();
    expect(login.user.id).toBeDefined();
    expect(login.account_user).toBeInstanceOf(Array<AccountUser>);
  });

  // it('should get permissions', async () => {
  //   expect(permission).toBeInstanceOf(Permission);

  //   const groups = await permissionsController.getPermissions({ user }, account.id);
  //   expect(groups[0]).toBeInstanceOf(Group);
  //   expect(groups[0].permissions).toBeInstanceOf(Array);
  //   expect(groups[0].permissions[0]).toBeInstanceOf(Permission);
  // });

  it('validate permission before to redirect', async () => {
    const { user, account_user } = await authController.signIn({ email: 'email', pass: 'pass' });
    const redirect = await validatorController.validator(
      {
        user: user,
        account_user_id: account_user[0].id,
        method: 'GET',
        url: `/empresa/1`,
        headers: { 'Content-Type': 'application/json', account: JSON.stringify(account) },
      },
      undefined,
    );

    expect(JSON.parse(redirect.headers?.account).plans).toBeDefined();
    expect(JSON.parse(redirect.headers?.user).email).toBeDefined();

    expect(redirect.method).toBeDefined();
    expect(redirect.baseURL).toBeDefined();
    expect(redirect.url).toBeDefined();
  });
});
