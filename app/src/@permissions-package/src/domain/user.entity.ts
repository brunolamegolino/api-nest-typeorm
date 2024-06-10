import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Base } from './base';
import { AccountUser } from './account-user.entity';

@Entity()
@Unique(['email'])
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  email: string = null;

  @Column()
  pass: string = null;

  @OneToMany(() => AccountUser, (accountUser) => accountUser.user)
  account_user: Array<AccountUser> = null;
}
