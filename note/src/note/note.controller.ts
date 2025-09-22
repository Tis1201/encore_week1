import { api } from "encore.dev/api";
import applicationContext from "../applicationContext";
import { CreateNoteDto } from "./dto/create-note.dto";

export const getAllNote = api(
  { expose: true, method: 'GET', path: '/note' },
  async ({ page, limit }: { page?: string; limit?: string }) => {
    const context = await applicationContext;

    const { noteService } = context;

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    return noteService.findAll(pageNum, limitNum);
  },
);

export const getNoteById = api(
  { expose: true, method: 'GET', path: '/note/:id' },
  async ({ id }: { id: number }) => {
    const { noteService } = await applicationContext;

    return noteService.findOne(id);
  },
);

export const createNote = api(
  { expose: true, method: 'POST', path: '/note' },
  async (createNote: CreateNoteDto) => {
    const { noteService } = await applicationContext;

    return noteService.create(createNote);
  },
);

export interface UpdateNoteParams {
  id: number;
  title?: string;
  content?: string;
}

export const updateNote = api(
  { expose: true, method: 'PUT', path: '/note/:id' },
  async (params: UpdateNoteParams) => {
    const { noteService } = await applicationContext;
    const { id, ...updateData } = params;

    return noteService.update(id, updateData);
  },
);

export const deleteNote = api(
  { expose: true, method: 'DELETE', path: '/note/:id' },
  async ({ id }: { id: number }) => {
    const { noteService } = await applicationContext;

    return noteService.remove(id);
  },
);
