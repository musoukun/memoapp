import { Router } from "express";
import * as noteController from "../controllers/note";
import * as tokenHandler from "../middleware/tokenHandler";
import { param } from "express-validator";
import * as validation from "../middleware/validation";
import { verifyToken } from "../middleware/tokenHandler";

const router = Router();

router.use(verifyToken);
router.get("/test", noteController.test);

//📝を作成
router.post("/", noteController.create);
//📝を取得
router.get("/", noteController.getAll);

// メモを更新
router.put("/", noteController.updatePosition);
// お気に入りメモを取得
router.get("/favorites", noteController.getFavorites);
// 最近のメモを取得
router.get("/recent", noteController.getRecentNotes);

router.get(
	"/:noteId",
	param("noteId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	noteController.getOne
);

router.put(
	"/:noteId",
	param("noteId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	noteController.update
);

router.delete(
	"/:noteId",
	param("noteId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	noteController.deleteNote
);

export default router;
