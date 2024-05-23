import { Base } from "@permissions-package/domain/base";
import { IsString, MinLength } from "class-validator";

export class GetPermissionsDto extends Base {
    @IsString()
    @MinLength(1)
    account_id: string = null;   
}