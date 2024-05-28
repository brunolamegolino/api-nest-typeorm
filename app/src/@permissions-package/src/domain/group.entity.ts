import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Permission } from './permission.entity';
import { Account } from './account.entity';
import { User } from './user.entity';

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

  @ManyToMany(() => User, (user) => user.groups, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'group_users',
    synchronize: true,
    joinColumns: [{ name: 'group_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
  })
  users: Array<User> = null;
}
