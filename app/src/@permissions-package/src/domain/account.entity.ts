import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Plan } from './plan.entity';

@Entity()
export class Account extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @OneToMany(() => Plan, (plan) => plan.account)
  plans: Array<Plan> = null;
}
