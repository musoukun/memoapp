import { Router } from "express";
import * as memoController from "../controllers/memo";
import * as tokenHandler from "../handlers/tokenHandler";
import { param } from "express-validator";
import * as validation from "../handlers/validation";

const router = Router();

router.get("/test", memoController.test);

//📝を作成
router.post("/", tokenHandler.verifyToken, memoController.create);
//📝を取得
router.get("/", tokenHandler.verifyToken, memoController.getAll);

// メモを更新
router.put("/", tokenHandler.verifyToken, memoController.updatePosition);
// お気に入りメモを取得
router.get("/favorites", tokenHandler.verifyToken, memoController.getFavorites);
// 最近のメモを取得
router.get("/recent", tokenHandler.verifyToken, memoController.getRecentMemos);

router.get(
	"/:memoId",
	param("memoId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	memoController.getOne
);

router.put(
	"/:memoId",
	param("memoId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	memoController.update
);

router.delete(
	"/:memoId",
	param("memoId").custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject("無効なIDです。");
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	memoController.deleteMemo
);

export default router;
