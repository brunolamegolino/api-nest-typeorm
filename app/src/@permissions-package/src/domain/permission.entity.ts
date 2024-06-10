import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Resource } from './resouce.entity';
import { AccountUser } from './account-user.entity';

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  action: string = null;

  @ManyToOne(() => Resource, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resource_id', referencedColumnName: 'id' })
  resource: Resource = null;

  @Column({ nullable: true })
  elements_filter: string = null;

  @Column({ nullable: true })
  elements: string = null;

  @ManyToOne(() => AccountUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'account_user_id', referencedColumnName: 'id' })
  account_user: AccountUser = null;
}
