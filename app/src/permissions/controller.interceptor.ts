import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
// import mongoose from 'mongoose';

@Injectable()
export class ControllerInteceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    // const session = await mongoose.startSession();
    try {
      // session.startTransaction();
      const result = next.handle();
      // session.commitTransaction();
      return result;
    } catch (error: any) {
      // session.abortTransaction();
      if (error instanceof HttpException && error.getStatus() < 500) {
        throw error;
      }

      throw new InternalServerErrorException('Erro interno no servidor');
    }
  }
}
