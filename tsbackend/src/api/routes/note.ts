import { Router } from "express";
import * as noteController from "../controllers/note";
import * as tokenHandler from "../middleware/tokenHandler";
import { param } from "express-validator";
import * as validation from "../middleware/validation";

const router = Router();

router.get("/test", noteController.test);

//📝を作成
router.post("/", tokenHandler.verifyToken, noteController.create);
//📝を取得
router.get("/", tokenHandler.verifyToken, noteController.getAll);

// メモを更新
router.put("/", tokenHandler.verifyToken, noteController.updatePosition);
// お気に入りメモを取得
router.get("/favorites", tokenHandler.verifyToken, noteController.getFavorites);
// 最近のメモを取得
router.get("/recent", tokenHandler.verifyToken, noteController.getRecentNotes);

router.get(
	"/:noteId",
	param("noteId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
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
	tokenHandler.verifyToken,
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
	tokenHandler.verifyToken,
	noteController.deleteNote
);

export default router;
