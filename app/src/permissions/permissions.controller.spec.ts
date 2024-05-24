import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { PermissionsController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';
import { Permission } from '@permissions-package/domain/permission.entity';
import { GroupUser } from '@permissions-package/domain/groupUser.entity';
import { Group } from '@permissions-package/domain/group.entity';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let database: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [...PermissionsProvider],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    database = module.get<DataSource>('Database');
    for (const entity of database.entityMetadatas) {
      const seq =
        entity.name
          .replace(/(?<!^)([A-Z])/g, (char) => '_' + char.toLowerCase())
          .toLowerCase() + '_id_seq';
      await database.getRepository(entity.name).delete({});
      const queryRunner = database.createQueryRunner();
      await queryRunner.query(`ALTER SEQUENCE ${seq} RESTART WITH 1`);
      await queryRunner.release();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get permissions', async () => {
    const group = await database.manager.save(
      await Group.create({
        id: '1',
        account_id: '1',
        name: 'grupo 1',
      }),
    );

    const permission = await Permission.create(
      {
        account_id: '1',
        group: group,
        action: 'read',
        recurso_id: '1',
      },
      true,
    );

    await database.manager.save(permission);

    await database.manager.save(
      await GroupUser.create(
        {
          group_id: '1',
          user_id: '1',
        },
        true,
      ),
    );

    const accontId = '1';
    const permissions = await controller.getPermissions(accontId);
    expect(permissions[0]).toBeInstanceOf(Group);
    expect(permissions[0].permissions).toBeInstanceOf(Array);
    expect(permissions[0].permissions[0]).toBeInstanceOf(Permission);
  });
});
