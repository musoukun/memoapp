import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createKanban = async (req: Request, res: Response) => {
	try {
		const { title, columns } = req.body;
		const userId = req.user!.id;

		const kanban = await prisma.kanban.create({
			data: {
				title,
				columns: columns,
				userId,
			},
		});

		res.status(201).json(kanban);
	} catch (err) {
		res.status(500).json({ error: "Failed to create Kanban" });
	}
};

export const getKanbans = async (req: Request, res: Response) => {
	try {
		const userId = req.user!.id;
		const kanbans = await prisma.kanban.findMany({
			where: { userId },
		});
		res.status(200).json(kanbans);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch Kanbans" });
	}
};

export const getKanban = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user!.id;

		const kanban = await prisma.kanban.findUnique({
			where: { id, userId },
		});

		if (!kanban) {
			return res.status(404).json({ error: "Kanban not found" });
		}

		res.status(200).json(kanban);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch Kanban" });
	}
};

export const getMainKanban = async (req: Request, res: Response) => {
	try {
		// const { id } = req.params;
		const userId = req.user!.id;

		const kanban = await prisma.kanban.findFirst({
			where: { userId },
			orderBy: { createdAt: "asc" }, // 一番古いカンバンを取得
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
		const { title, data } = req.body;
		const userId = req.user!.id;

		const updatedKanban = await prisma.kanban.update({
			where: { id, userId },
			data: {
				title,
				columns: data,
			},
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
