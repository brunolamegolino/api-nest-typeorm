import { Module } from '@nestjs/common';
import { AuthController, PermissionsController, ValidatorController } from './permissions.controller';
import { DatabaseProvider, PermissionsProvider } from './permissions.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController, PermissionsController, ValidatorController],
  providers: [...PermissionsProvider],
  exports: [DatabaseProvider],
})
export class PermissionsModule {}
