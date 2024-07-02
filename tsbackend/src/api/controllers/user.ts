import CryptoJS from "crypto-js";
import jsonwebtoken from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

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
			process.env.PASS as string
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
			process.env.TOKEN as string,
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

	try {
		const user: User | null = await prisma.user.findUnique({
			where: { username: username },
		});
		if (!user) {
			res.status(401).json({
				message: "ユーザー名かパスワードが無効です。",
			});
			return;
		}

		const decryptedPassword: string = CryptoJS.AES.decrypt(
			user.passwordDigest!,
			process.env.PASS!
		).toString(CryptoJS.enc.Utf8);
		if (decryptedPassword !== password) {
			res.status(401).json({
				message: "ユーザー名かパスワードが無効です。",
			});
			return;
		}

		const token: string = jsonwebtoken.sign(
			{ id: user.id },
			process.env.TOKEN!,
			{
				expiresIn: "24h",
			}
		);
		res.status(201).json({ user, token });
	} catch (err: any) {
		res.status(500).json(err);
	}
};
