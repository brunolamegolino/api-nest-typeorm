import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base";

@Entity()
export class Group extends Base {
    @PrimaryGeneratedColumn()
    id: string = null;

    @Column()
    account_id: string = null;

    @Column()
    name: string = null;
}