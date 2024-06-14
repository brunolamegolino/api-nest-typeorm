import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Resource } from './resouce.entity';
import { AccountProducts } from './account-products.entity';

@Entity()
export class Product extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string = null;

  @Column()
  name: string = null;

  @OneToMany(() => AccountProducts, (accountProducts) => accountProducts.product)
  account_products: Array<AccountProducts> = null;

  @OneToMany(() => Resource, (resouce) => resouce.product)
  resources: Array<Resource> = null;
}
