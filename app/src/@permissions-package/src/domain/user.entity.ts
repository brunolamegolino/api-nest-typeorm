import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  email: string = null;

  @Column()
  pass: string = null;
}
