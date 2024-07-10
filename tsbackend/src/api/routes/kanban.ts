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
router.get("/userkanbans", kanbanController.getKanbans);
// router.get("/", kanbanController.getAllKanbans);
router.get("/:id", kanbanController.getKanban);
router.put("/:id", kanbanController.updateKanban);
router.delete("/:id", kanbanController.deleteKanban);

// カンバンの作成
router.post("/", kanbanController.createKanban);

// すべてのカンバンの取得
router.get("/", kanbanController.getKanbans);

// すべてのカンバンの取得
router.get("/main", kanbanController.getMainKanban);

// 特定のカンバンの取得
router.get("/:id", kanbanController.getKanban);

// カンバンの更新
router.put("/:id", kanbanController.updateKanban);

// カンバンの削除
router.delete("/:id", kanbanController.deleteKanban);

export default router;
