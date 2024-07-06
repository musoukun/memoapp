/* eslint-disable prefer-const */
import { Note, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import { CustomRequest } from "../types/note";
import { NotePositionUpdateBody } from "../types/note";

export const test = async (req: Request, res: Response) => {
	res.send("noteAPI test");
};

export const create = async (
	req: CustomRequest<{ position: number }>,
	res: Response
) => {
	try {
		const noteCount = await prisma.note.count();
		const note = await prisma.note.create({
			data: {
				userId: req.user!.id,
				position: noteCount,
			},
		});
		res.status(201).json(note);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const getAll = async (req: CustomRequest<{}>, res: Response) => {
	try {
		const notes = await prisma.note.findMany({
			where: { userId: req.user!.id },
			orderBy: { position: "asc" },
		});
		res.status(200).json(notes);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const updatePosition = async (
	req: CustomRequest<NotePositionUpdateBody>,
	res: Response
) => {
	const { notes } = req.body as NotePositionUpdateBody;
	try {
		await Promise.all(
			notes.reverse().map((note, index) =>
				prisma.note.update({
					where: { id: note.id },
					data: { position: index },
				})
			)
		);
		res.status(200).json("更新しました");
	} catch (err) {
		res.status(500).json(err);
	}
};

export const getOne = async (req: CustomRequest<{}>, res: Response) => {
	const noteId = req.params.noteId!;
	try {
		const note = await prisma.note.findUnique({
			where: { id: noteId, userId: req.user!.id },
		});
		if (!note) return res.status(404).json("メモが存在しません");
		res.status(200).json(note);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const update = async (req: CustomRequest<Note>, res: Response) => {
	const noteId = req.params.noteId!;
	let { title, description, favorite, icon } = req.body as Note;

	title = title === "" ? "" : title;
	description = description === "" ? "" : description;

	try {
		// 現在のメモを取得
		const currentNote = await prisma.note.findUnique({
			where: { id: noteId },
		});

		if (!currentNote) {
			return res.status(404).json("メモが存在しません");
		}

		// メモの内容を更新
		const updatedNote = await prisma.note.update({
			where: { id: noteId },
			data: {
				title,
				description,
				icon,
				favorite,
				lastAccessedAt: new Date(),
				accessCount: { increment: 1 },
				favoritePosition: favorite ? req.body.favoritePosition : 0,
			},
		});

		res.status(200).json(updatedNote);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

export const getFavorites = async (req: CustomRequest<{}>, res: Response) => {
	try {
		const favorites = await prisma.note.findMany({
			where: { userId: req.user!.id, favorite: true },
			orderBy: { favoritePosition: "desc" },
		});
		res.status(200).json(favorites);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const deleteNote = async (req: CustomRequest<{}>, res: Response) => {
	const noteId = req.params.noteId!;
	try {
		await prisma.note.delete({
			where: { id: noteId },
		});
		res.status(200).json("メモを削除しました");
	} catch (err) {
		res.status(500).json(err);
	}
};

// メモの最近のアクセス履歴を取得
export const getRecentNotes = async (req: CustomRequest<{}>, res: Response) => {
	const userId = req.user.id!;

	try {
		const recentNotes = await prisma.note.findMany({
			where: { userId: userId },
			orderBy: { lastAccessedAt: "desc" },
			take: 10, // Limit to 10 most recent notes
			select: {
				id: true,
				title: true,
				icon: true,
				lastAccessedAt: true,
			},
		});

		res.json(recentNotes);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch recent notes" });
	}
};
