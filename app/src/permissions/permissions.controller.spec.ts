import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';
import { Permission } from '@permissions-package/domain/permission.entity';
import { DataSource, Repository } from 'typeorm';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let permissionRepository: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [...PermissionsProvider],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    permissionRepository = (module.get<DataSource>('Database')).getRepository(Permission.name);
    permissionRepository.delete({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get permissions', async () => {
    await permissionRepository.save(await Permission.create({
      account_id: '1',
      group_id: '1',
      action: 'read',
      recurso_id: '1'
    }, true))

    const accontId = '1';
    const permissions = await controller.getPermissions(accontId);
    expect(permissions).toBeInstanceOf(Array<Permission>);
  });
});
