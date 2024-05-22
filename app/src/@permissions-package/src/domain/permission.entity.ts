import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base";

@Entity()
export class Permission extends Base {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
}