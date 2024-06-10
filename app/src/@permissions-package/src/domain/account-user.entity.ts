import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity()
export class AccountUser extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  role: string = null;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account = null;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User = null;

  @OneToMany(() => Permission, (permission) => permission.account_user, { onDelete: 'CASCADE' })
  @JoinColumn()
  permissions: Array<Permissions> = null;
}
