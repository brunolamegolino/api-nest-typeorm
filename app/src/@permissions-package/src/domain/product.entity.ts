import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Plan } from './plan.entity';
import { Resource } from './resouce.entity';
import { IsString } from 'class-validator';

@Entity()
export class Product extends Base {
  @PrimaryGeneratedColumn()
  id: number = null;

  @IsString()
  name: string = null;

  @ManyToMany(() => Plan, (plan) => plan.products, { onDelete: 'CASCADE' })
  plans: Array<Plan> = null;

  @OneToMany(() => Resource, (resouce) => resouce.product)
  resources: Array<Resource> = null;
}
