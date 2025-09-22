import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { NoteModule } from './note/note.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/fliters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MetricModule } from './metric/metric.module';

@Module({
  imports: [CatsModule, NoteModule, PrismaModule, MetricModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
