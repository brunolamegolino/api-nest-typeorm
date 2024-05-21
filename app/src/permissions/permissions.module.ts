import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';

@Module({
  controllers: [PermissionsController],
  providers: [...PermissionsProvider],
})
export class PermissionsModule {}
