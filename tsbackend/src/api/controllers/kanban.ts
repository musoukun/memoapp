import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createKanban = async (req: Request, res: Response) => {
	try {
		const { title, main } = req.body;
		const userId = req.user!.id;

		const kanban = await prisma.kanban.create({
			data: {
				title,
				userId,
				main: main,
				columns: {
					create: [
						{ title: "未着手" },
						{ title: "進行中" },
						{ title: "完了" },
					],
				},
			},
			include: {
				columns: {
					include: {
						cards: true,
					},
				},
			},
		});

		res.status(201).json(kanban);
	} catch (err) {
		res.status(500).json({ error: "Failed to create Kanban" });
	}
};

export const getUserKanbans = async (req: Request, res: Response) => {
	try {
		const userId = req.user!.id;
		const kanbans = await prisma.kanban.findMany({
			where: { userId },
			include: {
				columns: {
					include: {
						cards: true,
					},
				},
			},
		});

		if (!kanbans) {
			return res.status(200).json({ error: "Kanbans not found" });
		}

		res.status(200).json(kanbans);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch Kanbans" });
	}
};

export const getMainKanban = async (req: Request, res: Response) => {
	try {
		const userId = req.user!.id;
		// 1件のデータをmapでまわせるように配列として返したい

		const result = await prisma.kanban.findFirst({
			where: { userId, main: true },
			include: {
				columns: {
					include: {
						cards: true,
					},
				},
			},
		});

		// 結果を配列として返す
		const mainkanban = result ? [result] : [];

		res.status(200).json(mainkanban);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch Main Kanban" });
	}
};

export const getKanban = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user!.id;

		const kanban = await prisma.kanban.findUnique({
			where: { id, userId },
			include: {
				columns: {
					include: {
						cards: true,
					},
				},
			},
		});

		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		res.status(200).json(kanban);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch Kanban" });
	}
};

export const updateKanban = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title } = req.body;
		const userId = req.user!.id;

		const updatedKanban = await prisma.kanban.update({
			where: { id, userId },
			data: { title },
		});

		res.status(200).json(updatedKanban);
	} catch (err) {
		res.status(500).json({ error: "Failed to update Kanban" });
	}
};

export const deleteKanban = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user!.id;

		await prisma.kanban.delete({
			where: { id, userId },
		});

		res.status(200).json({ message: "Kanban deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete Kanban" });
	}
};

export const addColumn = async (req: Request, res: Response) => {
	try {
		const { kanbanId } = req.params;
		const { title } = req.body;

		const newColumn = await prisma.kanbanColumn.create({
			data: {
				title,
				kanbanId,
			},
		});

		res.status(201).json(newColumn);
	} catch (err) {
		res.status(500).json({ error: "Failed to add column" });
	}
};

export const updateColumn = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title } = req.body;

		const updatedColumn = await prisma.kanbanColumn.update({
			where: { id },
			data: { title },
		});

		res.status(200).json(updatedColumn);
	} catch (err) {
		res.status(500).json({ error: "Failed to update column" });
	}
};

export const deleteColumn = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.kanbanColumn.delete({
			where: { id },
		});

		res.status(200).json({ message: "Column deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete column" });
	}
};

export const addCard = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		const { title, description, status } = req.body;

		const newCard = await prisma.kanbanCard.create({
			data: {
				title,
				description: description ?? "", // descriptionが提供されていない場合、空文字列をデフォルトとする
				status: status ?? null, // statusが提供されていない場合、nullをデフォルトとする
				columnId,
			},
		});

		res.status(201).json(newCard);
	} catch (err) {
		res.status(500).json({ error: "Failed to add card" });
	}
};

export const updateCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title, description, status } = req.body;

		const updatedCard = await prisma.kanbanCard.update({
			where: { id },
			data: {
				title,
				description,
				status, // statusが提供されていない場合、そのまま省略される
			},
		});

		res.status(200).json(updatedCard);
	} catch (err) {
		res.status(500).json({ error: "Failed to update card" });
	}
};

export const deleteCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.kanbanCard.delete({
			where: { id },
		});

		res.status(200).json({ message: "Card deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete card" });
	}
};

export const moveCard = async (req: Request, res: Response) => {
	try {
		const { cardId, newColumnId } = req.body;

		const updatedCard = await prisma.kanbanCard.update({
			where: { id: cardId },
			data: { columnId: newColumnId },
		});

		res.status(200).json(updatedCard);
	} catch (err) {
		res.status(500).json({ error: "Failed to move card" });
	}
};
