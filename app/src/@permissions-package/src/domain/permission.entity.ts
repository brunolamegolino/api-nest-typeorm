import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn()
  id: string = null;

  @Column()
  account_id: string = null;

  @Column()
  group_id: string = null;

  @Column()
  action: string = null;

  @Column()
  recurso_id: string = null;
}
