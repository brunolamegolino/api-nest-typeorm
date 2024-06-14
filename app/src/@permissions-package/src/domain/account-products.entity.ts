import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Account } from './account.entity';
import { Product } from './product.entity';

@Entity()
export class AccountProducts extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account = null;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product = null;

  @Column()
  price: number = null;

  @Column({ nullable: true })
  limit: number = null;
}
