import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base";

@Entity()
export class GroupUser extends Base {
    @PrimaryGeneratedColumn()
    id: string = null;

    @Column()
    group_id: string = null;

    @Column()
    user_id: number = null;
}