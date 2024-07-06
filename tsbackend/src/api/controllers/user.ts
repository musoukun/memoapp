import CryptoJS from "crypto-js";
import jsonwebtoken from "jsonwebtoken";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import env from "../../../env";
// import User from "../../api/types/express/index.d.ts";

const prisma = new PrismaClient();

export const test = async (req: Request, res: Response): Promise<void> => {
	res.send("authAPI test");
};

export const register = async (req: Request, res: Response): Promise<void> => {
	const password: string = req.body.password;
	console.log(password);

	try {
		const encryptedPassword: string = CryptoJS.AES.encrypt(
			password,
			env.PASS as string
		).toString();
		console.log(encryptedPassword);
		const user: User = await prisma.user.create({
			data: {
				username: req.body.username,
				passwordDigest: encryptedPassword,
			},
		});
		console.log(user);
		const token: string = jsonwebtoken.sign(
			{ id: user.id },
			env.TOKEN as string,
			{
				expiresIn: "24h",
			}
		);
		res.status(200).json({ user, token });
	} catch (err: any) {
		res.status(500).json(err);
		console.log(err);
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const username: string = req.body.username;
	const password: string = req.body.password;
	const errors: { path: string; msg: string }[] = [];

	try {
		const user: User | null = await prisma.user.findUnique({
			where: { username: username },
		});
		if (!user) {
			errors.push({
				path: "username",
				msg: "ユーザーが見つかりません。",
			});
		} else {
			const decryptedPassword: string = CryptoJS.AES.decrypt(
				user.passwordDigest!,
				env.PASS!
			).toString(CryptoJS.enc.Utf8);

			if (decryptedPassword !== password) {
				errors.push({
					path: "password",
					msg: "パスワードが無効です。",
				});
			}
		}

		if (errors.length > 0) {
			res.status(401).json({ errors: errors });
			return;
		}

		// ユーザーが見つかった場合
		const token: string = jsonwebtoken.sign({ id: user.id }, env.TOKEN!, {
			expiresIn: "24h",
		});
		res.status(201).json({ user, token });
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			console.error("Prisma known error:", err.message);
			res.status(500).json({ message: "Database error", code: err.code });
		} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
			console.error("Prisma unknown error:", err.message);
			res.status(500).json({ message: "Unknown database error" });
		} else {
			console.error("Unexpected error:", err);
			res.status(500).json({
				message:
					"システムエラーが発生しました。管理者にお問い合わせください。:Login_enviroment_error",
			});
		}
	}
};
