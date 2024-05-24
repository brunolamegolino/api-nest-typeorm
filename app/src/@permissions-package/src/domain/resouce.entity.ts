import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Product } from './product.entity';

@Entity()
export class Resource extends Base {
  @PrimaryGeneratedColumn()
  id: number = null;

  @Column()
  name: string = null;

  @Column()
  domain: string = null;

  @ManyToOne(() => Product, (product) => product.resources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product = null;
}
