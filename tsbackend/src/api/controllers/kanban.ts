import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialKanban = {
	id: "column-1",
	ColumnTitle: "kanban",
	cards: [{ id: "card-1", title: "カード1" }],
};

export const create = async (req: Request, res: Response) => {
	try {
		const kanban = await prisma.kanban.create({
			data: {
				userId: req.user.id,
				data: initialKanban,
			},
		});
		console.log("kanban created:", kanban);
		return res.status(201).json(kanban.data);
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
		});
		return res.json(kanbans);
	} catch (error) {
		console.error("Failed to fetch Kanbans:", error);
		return res.status(500).json({ error: "Failed to fetch Kanbans" });
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		const { kanbanId } = req.params;
		const { title, data } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.update({
			where: { id: kanbanId, userId },
			data: { title, data },
		});

		return res.json(kanban);
	} catch (error) {
		console.error("Failed to update Kanban:", error);
		return res.status(500).json({ error: "Failed to update Kanban" });
	}
};

export const getOne = async (req: Request, res: Response) => {
	try {
		const home = req.url === "/home";
		const { kanbanId } = req.params;
		const userId = req.user.id;

		let kanban;

		if (home) {
			kanban = await prisma.kanban.findFirst({
				where: { userId, home: home },
			});

			if (!kanban) {
				kanban = await prisma.kanban.create({
					data: {
						userId,
						home: home,
						data: initialKanban,
					},
				});
			}
		} else {
			// Ensure kanbanId is not undefined
			if (!kanbanId) {
				return res.status(400).json({ error: "Invalid kanban ID" });
			}

			kanban = await prisma.kanban.findUnique({
				where: { id: kanbanId },
			});

			// Check if the found kanban belongs to the current user
			if (kanban && kanban.userId !== userId) {
				return res.status(403).json({ error: "Access denied" });
			}
		}

		if (!kanban) {
			return res.status(201).json(null);
		}

		return res.json(kanban);
	} catch (error) {
		console.error("Failed to fetch Kanban:", error);
		return res.status(500).json({
			error: "Failed to fetch Kanban",
			details: (error as Error).message,
		});
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
