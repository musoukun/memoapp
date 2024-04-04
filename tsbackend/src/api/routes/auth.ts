import express, { Request, Response } from "express";
import { body } from "express-validator";
import * as validation from "../handlers/validation";
import * as userController from "../controllers/user";
import * as tokenHandler from "../handlers/tokenHandler";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/test", userController.test);
// ユーザー新規登録用API

router.post(
	"/register",
	body("username")
		.isLength({ min: 8 })
		.withMessage("ユーザー名は8文字以上である必要があります。"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("パスワードは8文字以上である必要があります。"),
	body("confirmPassword")
		.isLength({ min: 8 })
		.withMessage("確認用パスワードは8文字以上である必要があります。"),
	body("username").custom(async (value: string) => {
		const user = await prisma.user.findUnique({
			where: { username: value },
		});
		if (user) {
			return Promise.reject("このユーザー名はすでに使われています。");
		}
	}),
	validation.validate,
	userController.register
);

// ログイン用API
router.post(
	"/login",
	body("username")
		.isLength({ min: 8 })
		.withMessage("ユーザー名は8文字以上である必要があります。"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("パスワードは8文字以上である必要があります。"),
	validation.validate,
	userController.login
);

// トークン認証API
router.post(
	"/verify-token",
	tokenHandler.verifyToken,
	(req: Request | any, res: Response) => {
		res.status(200).json({ user: req.user });
	}
);

export default router;
