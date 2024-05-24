import { Module } from '@nestjs/common';
import {
  PermissionsController,
  ValidatorController,
} from './permissions.controller';
import { PermissionsProvider } from './permissions.provider';

@Module({
  controllers: [PermissionsController, ValidatorController],
  providers: [...PermissionsProvider],
})
export class PermissionsModule {}
