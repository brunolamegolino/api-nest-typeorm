import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';

@Entity()
export class GroupUser extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  group_id: string = null;

  @Column()
  user_id: string = null;
}
