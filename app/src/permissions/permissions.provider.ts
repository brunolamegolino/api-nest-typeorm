import { Provider } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import useCases from '@permissions-package/application';
import { createDatabase } from 'typeorm-extension';

const useCaseProviderGenerator = (): Array<Provider> => {
  const useCasesProvider = [];

  for (const useCase of Object.values(useCases)) {
    useCasesProvider.push({
      provide: useCase.name,
      useFactory: (database: any) => new useCase(database),
      inject: ['Database'],
    });
  }
  return useCasesProvider;
};

export const DatabaseProvider: Provider = {
  provide: 'Database',
  useFactory: async () => {
    let databaseName = process.env.DB_NAME || 'permissions';
    if (process.env.NODE_ENV === 'test') databaseName = databaseName + '_test';

    const config: DataSourceOptions = {
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: databaseName,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: ['error'],
    };

    // await createDatabase({ options: config, ifNotExist: true });

    const dataSource = new DataSource(config);

    return await dataSource.initialize();
  },
};

export const PermissionsProvider: Array<Provider> = [DatabaseProvider, ...useCaseProviderGenerator()];
