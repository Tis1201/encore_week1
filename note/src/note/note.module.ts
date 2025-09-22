import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  providers: [NoteService],

})
export class NoteModule {}
