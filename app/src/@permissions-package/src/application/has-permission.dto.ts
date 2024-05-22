import { Base } from "@permissions-package/domain/base";
import { IsArray, IsString } from "class-validator";

export class DtoHasPermission extends Base {
    @IsString()
    account_id: string = null;
    
    @IsArray()
    group_id: Array<string> = null;
    
    @IsString()
    action: string = null;
    
    @IsString()
    recurso_id: string = null;
}