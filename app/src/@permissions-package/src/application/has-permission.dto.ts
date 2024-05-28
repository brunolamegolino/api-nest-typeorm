import { Account } from '@permissions-package/domain/account.entity';
import { Base } from '@permissions-package/domain/base';
import { Group } from '@permissions-package/domain/group.entity';
import { Permission } from '@permissions-package/domain/permission.entity';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { IsArray, IsInstance } from 'class-validator';

export class DtoHasPermission extends Base {
  @IsInstance(Account)
  account: Account = null;

  @IsArray()
  groups: Array<Group> = null;

  @IsInstance(Permission)
  permission: Permission = null;

  @IsInstance(Resource)
  resource: Resource = null;
}
