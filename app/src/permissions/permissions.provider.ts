import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import useCases from '@permissions-package/application';

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
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'permissions',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: ['error'],
    });

    return await dataSource.initialize();
  },
};

export const PermissionsProvider: Array<Provider> = [
  DatabaseProvider,
  ...useCaseProviderGenerator(),
];
