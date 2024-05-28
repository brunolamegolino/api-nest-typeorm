import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base';
import { Product } from './product.entity';
import { Permission } from './permission.entity';

@Entity()
export class Resource extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  name: string = null;

  @Column()
  domain: string = null;

  @ManyToOne(() => Product, (product) => product.resources, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product = null;

  @OneToMany(() => Permission, (resouce) => resouce.resource, {
    onDelete: 'SET NULL',
  })
  permissions: Array<Permission> = null;
}
