import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn()
  id: number = null;

  @Column()
  account_id: string = null;

  @ManyToOne(() => Group, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: Group = null;

  @Column()
  action: string = null;

  @Column()
  recurso_id: string = null;

  @Column({ nullable: true })
  elements_filter: string = null;

  @Column({ nullable: true })
  elements: string = null;
}
