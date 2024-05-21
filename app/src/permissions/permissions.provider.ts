import { Provider } from '@nestjs/common';
import { HasResources } from '@permissions-package/application/has-resources';
import { DataSource } from 'typeorm';

export const PermissionsProvider: Array<Provider> = [
  // {
  //   provide: 'Mysql',
  //   useFactory: async () => {
  //     const dataSource = new DataSource({
  //       type: 'mysql',
  //       host: 'mysql',
  //       port: 3306,
  //       username: 'root',
  //       password: '',
  //       database: 'permissions',
  //       entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  //       synchronize: true,
  //       logging: true,
  //     });

  //     return dataSource.initialize();
  //   },
  // },
  {
    provide: 'Postgres',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'permissions',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
  {
    provide: HasResources,
    useFactory: (database: any) => new HasResources(database),
    inject: ['Postgres'],
  },
];
