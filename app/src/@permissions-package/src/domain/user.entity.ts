import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';

@Entity()
@Unique(['email'])
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  email: string = null;

  @Column()
  pass: string = null;

  @ManyToMany(() => Group, (group) => group.users, { onDelete: 'CASCADE' })
  groups: Array<Group> = null;
}
