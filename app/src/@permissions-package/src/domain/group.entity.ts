import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Permission } from './permission.entity';
import { Account } from './account.entity';

@Entity()
export class Group extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @ManyToOne(() => Account, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account = null;

  @Column()
  name: string = null;

  @OneToMany(() => Permission, (permission) => permission.group)
  permissions: Array<Permission> = null;
}
