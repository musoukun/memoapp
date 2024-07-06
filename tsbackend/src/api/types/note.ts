import exp from "constants";
import { Note } from "@prisma/client";
import { Prisma } from "@prisma/client";

type NotePositionUpdateBody = {
	notes: { id: string }[];
};

interface CustomRequest<T> {
	user?: { id: string };
	body: T | Note;
	params: { noteId?: string };
}

export type { NotePositionUpdateBody, CustomRequest };
