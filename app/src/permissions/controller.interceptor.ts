import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ControllerInteceptor implements NestInterceptor {
  constructor(@Inject('Database') readonly database: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    const session = this.database.createQueryRunner();
    session.connect();
    try {
      session.startTransaction();
      const result = next.handle();
      session.commitTransaction();

      return result;
    } catch (error: any) {
      session.rollbackTransaction();
      session.release();
      if (error instanceof HttpException && error.getStatus() < 500) {
        throw error;
      }
      throw new InternalServerErrorException('Erro interno no servidor');
    }
  }
}
