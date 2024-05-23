import { Base } from '@permissions-package/domain/base';
import { Group } from '@permissions-package/domain/group.entity';
import { IsArray, IsString } from 'class-validator';

export class DtoHasPermission extends Base {
  @IsString()
  account_id: string = null;

  @IsArray()
  groups: Array<Group> = null;

  @IsString()
  action: string = null;

  @IsString()
  recurso_id: string = null;
}
