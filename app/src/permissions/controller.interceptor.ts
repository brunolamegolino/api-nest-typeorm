import { BadRequestException, CallHandler, ExecutionContext, HttpException, Inject, Injectable, InternalServerErrorException, NestInterceptor } from '@nestjs/common';
import { firstValueFrom, Observable, of, take } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class ControllerInteceptor implements NestInterceptor {
  constructor(@Inject('Database') readonly database: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
    const session = this.database.createQueryRunner();
    await session.connect();
    try {
      await session.startTransaction();
      const result = await firstValueFrom(next.handle().pipe(take(1)));
      await session.commitTransaction();

      if (result instanceof Observable) return result;
      return of(result);
      //
    } catch (error: any) {
      await session.rollbackTransaction();
      await session.release();

      let message = '';
      if (error?.message) message = error.message;
      if (error?.detail) message = error.detail;
      if (error?.driverError?.detail) message = error.driverError.detail;
      if ((error instanceof HttpException && error.getStatus() < 500) || message) {
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException('Erro interno no servidor');
    }
  }
}
