import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Account } from './account.entity';
import { Product } from './product.entity';

@Entity()
export class Plan extends Base {
  @PrimaryGeneratedColumn()
  id: number = null;

  @ManyToOne(() => Account, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account = null;

  @ManyToMany(() => Product, (product) => product.plans, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'plan_products',
    synchronize: true,
    joinColumns: [{ name: 'plan_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'product_id', referencedColumnName: 'id' }],
  })
  products: Array<Product> = null;
}
