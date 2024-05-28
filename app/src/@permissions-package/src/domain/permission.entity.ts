import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';
import { Account } from './account.entity';
import { Resource } from './resouce.entity';

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @ManyToOne(() => Account, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account = null;

  @ManyToOne(() => Group, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: Group = null;

  @Column()
  action: string = null;

  @ManyToOne(() => Resource, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'resource_id', referencedColumnName: 'id' })
  resource: Resource = null;

  @Column({ nullable: true })
  elements_filter: string = null;

  @Column({ nullable: true })
  elements: string = null;
}
