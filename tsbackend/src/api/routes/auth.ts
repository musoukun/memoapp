import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as userController from "../controllers/user";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/tokenHandler";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/test", userController.test);
// ユーザー新規登録用API

router.post(
	"/register",
	body("username"),
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
	userController.register
);

// ログイン用API
router.post(
	"/login",
	body("username"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("パスワードは8文字以上である必要があります。"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				message: "バリデーションエラー",
				errors: errors.array(),
			});
		}
		next();
	},
	userController.login
);

// トークン認証API
router.post(
	"/verify-token",
	verifyToken,
	(req: Request | any, res: Response) => {
		res.status(200).json({ user: req.user });
	}
);

export default router;
