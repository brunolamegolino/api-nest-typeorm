import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { AccountProducts } from './account-products.entity';

@Entity()
export class Account extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column({ nullable: true })
  legacy_id: string = null;

  @Column()
  name: string = null;

  @OneToMany(() => AccountProducts, (accountProducts) => accountProducts.account)
  account_products: Array<AccountProducts> = null;
}
