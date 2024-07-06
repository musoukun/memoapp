import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Create a new Kanban
router.post("/", authenticateToken, async (req, res) => {
	try {
		const { title, data } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.create({
			data: {
				title,
				data,
				userId,
			},
		});

		res.status(201).json(kanban);
	} catch (error) {
		res.status(500).json({ error: "Failed to create Kanban" });
	}
});

// Get all Kanbans for a user
router.get("/", authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id;

		const kanbans = await prisma.kanban.findMany({
			where: { userId },
		});

		res.json(kanbans);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch Kanbans" });
	}
});

// Update a Kanban
router.put("/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { title, data } = req.body;
		const userId = req.user.id;

		const kanban = await prisma.kanban.update({
			where: { id, userId },
			data: { title, data },
		});

		res.json(kanban);
	} catch (error) {
		res.status(500).json({ error: "Failed to update Kanban" });
	}
});

// Delete a Kanban
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		await prisma.kanban.delete({
			where: { id, userId },
		});

		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error: "Failed to delete Kanban" });
	}
});

export default router;
