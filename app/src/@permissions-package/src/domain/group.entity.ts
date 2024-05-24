import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Permission } from './permission.entity';

@Entity()
export class Group extends Base {
  @PrimaryGeneratedColumn()
  id: number = null;

  @Column()
  account_id: string = null;

  @Column()
  name: string = null;

  @OneToMany(() => Permission, (permission) => permission.group)
  permissions: Array<Permission> = null;
}
