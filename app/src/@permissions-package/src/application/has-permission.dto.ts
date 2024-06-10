import { AccountUser } from '@permissions-package/domain/account-user.entity';
import { Account } from '@permissions-package/domain/account.entity';
import { Base } from '@permissions-package/domain/base';
import { Permission } from '@permissions-package/domain/permission.entity';
import { Resource } from '@permissions-package/domain/resouce.entity';
import { IsInstance } from 'class-validator';

export class DtoHasPermission extends Base {
  @IsInstance(Account)
  account: Account = null;

  @IsInstance(AccountUser)
  account_user: AccountUser = null;

  @IsInstance(Permission)
  permission: Permission = null;

  @IsInstance(Resource)
  resource: Resource = null;
}
