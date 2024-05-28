import { CallHandler, ExecutionContext, HttpException, Inject, Injectable, InternalServerErrorException, NestInterceptor } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ControllerInteceptor implements NestInterceptor {
  constructor(@Inject('Database') readonly database: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
    const session = this.database.createQueryRunner();
    await session.connect();
    try {
      await session.startTransaction();
      const result = await new Promise((resolve, reject) => {
        next.handle().subscribe(
          (data) => resolve(data),
          (error) => reject(error),
        );
      });
      await session.commitTransaction();

      return result;
    } catch (error: any) {
      await session.rollbackTransaction();
      await session.release();
      if (error instanceof HttpException && error.getStatus() < 500) {
        throw error;
      }
      throw new InternalServerErrorException('Erro interno no servidor');
    }
  }
}
