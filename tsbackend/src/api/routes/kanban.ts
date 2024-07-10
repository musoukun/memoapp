import express from "express";
import * as kanbanController from "../controllers/kanban";
import { verifyToken } from "../middleware/tokenHandler";

const router = express.Router();

router.use(verifyToken);
// Kanban routes
router.get("/test", (req, res) => {
	res.status(200).json({ message: "Kanban API is working" });
});
router.post("/", kanbanController.createKanban);
router.get("/main", kanbanController.getMainKanban);
router.get("/userkanbans", kanbanController.getUserKanbans);
// router.get("/", kanbanController.getAllKanbans);
router.get("/:id", kanbanController.getKanban);
router.put("/:id", kanbanController.updateKanban);
router.delete("/:id", kanbanController.deleteKanban);

// Column routes
router.post("/:kanbanId/columns", kanbanController.addColumn);
router.put("/columns/:id", kanbanController.updateColumn);
router.delete("/columns/:id", kanbanController.deleteColumn);

// Card routes
router.post("/columns/:columnId/cards", kanbanController.addCard);
router.put("/cards/:id", kanbanController.updateCard);
router.delete("/cards/:id", kanbanController.deleteCard);
router.post("/cards/move", kanbanController.moveCard);

export default router;
