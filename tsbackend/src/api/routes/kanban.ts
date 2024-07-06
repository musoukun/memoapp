import { Router } from "express";
import * as kanbanController from "../controllers/kanban";
import { param } from "express-validator";
import * as validation from "../middleware/validation";
import { verifyToken } from "../middleware/tokenHandler";

const router = Router();

router.use(verifyToken);

// Kanbanを作成
router.post("/", kanbanController.create);

// 全てのKanbanを取得
router.get("/", kanbanController.getAll);

// HomeのKanbanを取得
router.get("/home", kanbanController.getOne);

// Kanbanを更新（データ全体）
router.put(
	"/:kanbanId",
	param("kanbanId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),

	kanbanController.update
);

// 特定のKanbanを取得
router.get(
	"/:kanbanId",
	param("kanbanId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),

	kanbanController.getOne
);

// Kanbanを削除
router.delete(
	"/:kanbanId",
	param("kanbanId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),

	kanbanController.deleteKanban
);

export default router;
