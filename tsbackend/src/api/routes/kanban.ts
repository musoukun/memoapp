import { Router } from "express";
import * as kanbanController from "../controllers/kanban";
import { param, body } from "express-validator";
import * as validation from "../middleware/validation";
import { verifyToken } from "../middleware/tokenHandler";

const router = Router();

router.use(verifyToken);

router.post("/", kanbanController.create);
router.get("/", kanbanController.getAll);
router.get("/home", kanbanController.getOne);

router.get(
	"/:kanbanId",
	param("kanbanId").custom(validation.isObjectId),
	kanbanController.getOne
);
router.delete(
	"/:kanbanId",
	param("kanbanId").custom(validation.isObjectId),
	kanbanController.deleteKanban
);

router.post(
	"/:kanbanId/column",
	param("kanbanId").custom(validation.isObjectId),
	kanbanController.addColumn
);
router.delete(
	"/:kanbanId/column/:columnId",
	[
		param("kanbanId").custom(validation.isObjectId),
		param("columnId").custom(validation.isObjectId),
	],
	kanbanController.deleteColumn
);

router.post(
	"/:kanbanId/column/:columnId/card",
	[
		param("kanbanId").custom(validation.isObjectId),
		param("columnId").custom(validation.isObjectId),
	],
	kanbanController.addCard
);
router.delete(
	"/:kanbanId/column/:columnId/card/:cardId",
	[
		param("kanbanId").custom(validation.isObjectId),
		param("columnId").custom(validation.isObjectId),
		param("cardId").custom(validation.isObjectId),
	],
	kanbanController.deleteCard
);
router.put(
	"/:kanbanId/column/:columnId/card/:cardId",
	[
		param("kanbanId").custom(validation.isObjectId),
		param("columnId").custom(validation.isObjectId),
		param("cardId").custom(validation.isObjectId),
	],
	kanbanController.updateCard
);
router.put(
	"/:kanbanId/move-card/:cardId",
	[
		param("kanbanId").custom(validation.isObjectId),
		param("cardId").custom(validation.isObjectId),
		body("fromColumnId").custom(validation.isObjectId),
		body("toColumnId").custom(validation.isObjectId),
	],
	kanbanController.moveCard
);
router.put(
	"/:kanbanId/column/:columnId",
	[
		param("kanbanId").custom(validation.isObjectId),
		param("columnId").custom(validation.isObjectId),
		body("title").optional().isString(),
		// 必要に応じて他のバリデーションを追加
	],
	kanbanController.updateColumn
);

export default router;
