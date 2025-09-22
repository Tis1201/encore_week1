import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { BusinessLogicError, NotFoundError } from '../common/errors';
import { Paginator } from '../utils/paginator';
import { UpdateNoteDto } from './dto/update-note.dto';


@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    try {
      // Validate business rules
      if (!createNoteDto.title?.trim()) {
        throw new BusinessLogicError('Title cannot be empty');
      }

      if (!createNoteDto.content?.trim()) {
        throw new BusinessLogicError('Content cannot be empty');
      }

      return await this.prisma.note.create({
        data: {
          title: createNoteDto.title.trim(),
          content: createNoteDto.content.trim(),
        },
      });
    } catch (error) {
      if (error instanceof BusinessLogicError) {
        throw error;
      }
      
      throw new BusinessLogicError(
        'Failed to create note',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async findAll(page?: number, limit?: number) {
    const paginator = new Paginator(page, limit);
    return paginator.paginatePrisma(
      this.prisma.note.findMany({
        skip: paginator.offset,
        take: paginator.limit,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.note.count(),
    );
  }

  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BusinessLogicError('Invalid note ID');
    }

    const note = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundError(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    if (!id || id <= 0) {
      throw new BusinessLogicError('Invalid note ID');
    }

    // Check if note exists
    const existingNote = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundError(`Note with ID ${id} not found`);
    }

    // Validate update data
    if (updateNoteDto.title !== undefined && !updateNoteDto.title?.trim()) {
      throw new BusinessLogicError('Title cannot be empty');
    }

    if (updateNoteDto.content !== undefined && !updateNoteDto.content?.trim()) {
      throw new BusinessLogicError('Content cannot be empty');
    }

    try {
      return await this.prisma.note.update({
        where: { id },
        data: {
          ...(updateNoteDto.title && { title: updateNoteDto.title.trim() }),
          ...(updateNoteDto.content && {
            content: updateNoteDto.content.trim(),
          }),
        },
      });
    } catch (error) {
      throw new BusinessLogicError(
        'Failed to update note',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async remove(id: number) {
    if (!id || id <= 0) {
      throw new BusinessLogicError('Invalid note ID');
    }

    // Check if note exists
    const existingNote = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundError(`Note with ID ${id} not found`);
    }

    try {
      await this.prisma.note.delete({
        where: { id },
      });

      return { message: `Note with ID ${id} successfully deleted` };
    } catch (error) {
      throw new BusinessLogicError(
        'Failed to delete note',
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
