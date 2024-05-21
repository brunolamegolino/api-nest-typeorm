import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';

describe('PermissionsController', () => {
  let controller: PermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [...PermissionsProvider],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get permissions', () => {
    expect(controller.getPermissions()).toBe('empresas');
  });
});
