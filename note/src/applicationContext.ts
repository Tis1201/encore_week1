import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatsService } from './cats/cats.service';
import { CatsModule } from './cats/cats.module';
import { NoteService } from './note/note.service';
import { NoteModule } from './note/note.module';
import { MetricService } from './metric/metric.service';
import { MetricModule } from './metric/metric.module';
import { PrismaService } from './prisma/prisma.service';

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<{
  prismaService: PrismaService;
  catsService: CatsService;
  noteService: NoteService;
  metricService: MetricService;
}> = NestFactory.createApplicationContext(AppModule).then(async (app) => {
  const prismaService = app.get(PrismaService);
  if (prismaService.onModuleInit) {
    await prismaService.onModuleInit();
  }

  const noteService = app.get(NoteService);

  if (!(noteService as any).prisma && prismaService) {
    (noteService as any).prisma = prismaService;
  }
  return {
    catsService: app.select(CatsModule).get(CatsService, { strict: true }),
    noteService,
    metricService: app
      .select(MetricModule)
      .get(MetricService, { strict: true }),
    prismaService,
  };
});

export default applicationContext;
