import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialKanbanStructure = {
	title: "New Kanban",
	columns: [
		{
			title: "To Do",
			order: 0,
			cards: [
				{
					title: "新規タスク",
					order: 0,
				},
			],
		},
	],
};

export const create = async (req: Request, res: Response) => {
	try {
		// homeエンドポイントからのリクエストかどうかを判定
		const isHome = req.url === "/home";
		let home = false;
		if (isHome) {
			home = true;
		}
		const kanban = await prisma.kanban.create({
			data: {
				userId: req.user.id,
				title: initialKanbanStructure.title,
				home: home,
				columns: {
					create: initialKanbanStructure.columns.map((column) => ({
						title: column.title,
						order: column.order,
						cards: {
							create: column.cards.map((card) => ({
								title: card.title,
								order: card.order,
							})),
						},
					})),
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
		console.log("kanban created:", kanban);
		return res.status(201).json(kanban);
	} catch (error) {
		console.error("Failed to create Kanban:", error);
		return res.status(500).json({ error: "Failed to create Kanban" });
	}
};

export const getAll = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
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
		return res.json(kanbans);
	} catch (error) {
		console.error("Failed to fetch Kanbans:", error);
		return res.status(500).json({ error: "Failed to fetch Kanbans" });
	}
};

export const home = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const kanban = await prisma.kanban.findFirst({
			where: { userId, home: true },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			create(req, res);
			return;
		}
		return res.json(kanban);
	} catch (error) {
		console.error("Failed to fetch Kanban:", error);
		return res.status(500).json({ error: "Failed to fetch Kanban" });
	}
};

export const getOne = async (req: Request, res: Response) => {
	try {
		const { kanbanId } = req.params;
		const userId = req.user.id;
		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}
		return res.json(kanban);
	} catch (error) {
		console.error("Failed to fetch Kanban:", error);
		return res.status(500).json({ error: "Failed to fetch Kanban" });
	}
};

export const addColumn = async (req: Request, res: Response) => {
	try {
		const { kanbanId } = req.params;
		const { title } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		const newColumn = await prisma.kanbanColumn.create({
			data: {
				title: title,
				order: kanban.columns.length,
				kanbanId,
			},
		});

		return res.status(201).json(newColumn);
	} catch (error) {
		console.error("Failed to add column:", error);
		return res.status(500).json({ error: "Failed to add column" });
	}
};

export const deleteColumn = async (req: Request, res: Response) => {
	try {
		const { kanbanId, columnId } = req.params;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		await prisma.kanbanColumn.delete({
			where: { id: columnId },
		});

		return res.status(204).end();
	} catch (error) {
		console.error("Failed to delete column:", error);
		return res.status(500).json({ error: "Failed to delete column" });
	}
};

export const addCard = async (req: Request, res: Response) => {
	try {
		const { kanbanId, columnId } = req.params;
		const { title } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		const newCard = await prisma.kanbanCard.create({
			data: {
				title,
				order: kanban.columns.find((col) => col.id === columnId)?.cards
					.length,
				columnId,
			},
		});

		return res.status(201).json(newCard);
	} catch (error) {
		console.error("Failed to add card:", error);
		return res.status(500).json({ error: "Failed to add card" });
	}
};

export const deleteCard = async (req: Request, res: Response) => {
	try {
		const { kanbanId, columnId, cardId } = req.params;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		await prisma.kanbanCard.delete({
			where: { id: cardId },
		});

		return res.status(204).end();
	} catch (error) {
		console.error("Failed to delete card:", error);
		return res.status(500).json({ error: "Failed to delete card" });
	}
};

export const updateCard = async (req: Request, res: Response) => {
	try {
		const { kanbanId, columnId, cardId } = req.params;
		const { title } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		const updatedCard = await prisma.kanbanCard.update({
			where: { id: cardId },
			data: { title },
		});

		return res.json(updatedCard);
	} catch (error) {
		console.error("Failed to update card:", error);
		return res.status(500).json({ error: "Failed to update card" });
	}
};

export const moveCard = async (req: Request, res: Response) => {
	try {
		const { kanbanId, cardId } = req.params;
		const { fromColumnId, toColumnId } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: {
					orderBy: { order: "asc" },
					include: {
						cards: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		const fromColumn = kanban.columns.find(
			(col) => col.id === fromColumnId
		);
		const toColumn = kanban.columns.find((col) => col.id === toColumnId);
		if (!fromColumn || !toColumn) {
			return res.status(404).json({ error: "Column not found" });
		}

		const card = fromColumn.cards.find((c) => c.id === cardId);
		if (!card) {
			return res.status(404).json({ error: "Card not found" });
		}

		const updatedCard = await prisma.kanbanCard.update({
			where: { id: cardId },
			data: { columnId: toColumnId },
		});

		return res.json(updatedCard);
	} catch (error) {
		console.error("Failed to move card:", error);
		return res.status(500).json({ error: "Failed to move card" });
	}
};

export const deleteKanban = async (req: Request, res: Response) => {
	try {
		const { kanbanId } = req.params;
		const userId = req.user.id;

		await prisma.kanban.delete({
			where: { id: kanbanId, userId },
		});

		return res.status(204).end();
	} catch (error) {
		console.error("Failed to delete Kanban:", error);
		return res.status(500).json({ error: "Failed to delete Kanban" });
	}
};

export const updateColumn = async (req: Request, res: Response) => {
	try {
		const { kanbanId, columnId } = req.params;
		const { title } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.findFirst({
			where: { id: kanbanId, userId },
			include: {
				columns: true,
			},
		});

		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		const column = kanban.columns.find((col) => col.id === columnId);
		if (!column) {
			return res.status(404).json({ error: "Column not found" });
		}

		const updatedColumn = await prisma.kanbanColumn.update({
			where: { id: columnId },
			data: { title },
		});

		return res.json(updatedColumn);
	} catch (error) {
		console.error("Failed to update column:", error);
		return res.status(500).json({ error: "Failed to update column" });
	}
};
