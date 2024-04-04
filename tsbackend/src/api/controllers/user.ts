import CryptoJS from "crypto-js";
import jsonwebtoken from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const test = async (req, res) => {
	res.send("authAPI test");
};

export const register = async (req, res) => {
	const password = req.body.password;
	console.log(password);

	try {
		const encryptedPassword = CryptoJS.AES.encrypt(
			password,
			process.env.PASS as string
		).toString();
		console.log(encryptedPassword);
		const user = await prisma.user.create({
			data: {
				username: req.body.username,
				passwordDigest: encryptedPassword,
			},
		});
		console.log(user);
		const token = jsonwebtoken.sign(
			{ id: user.id },
			process.env.TOKEN as string,
			{
				expiresIn: "24h",
			}
		);
		res.status(200).json({ user, token });
	} catch (err) {
		res.status(500).json(err);
		console.log(err);
	}
};

export const login = async (req, res) => {
	const username: string = req.body.username;
	const password: string = req.body.password;

	try {
		const user = await prisma.user.findUnique({
			where: { username: username },
		});
		if (!user) {
			res.status(401).json({
				message: "ユーザー名かパスワードが無効です。",
			});
			return;
		}

		const decryptedPassword = CryptoJS.AES.decrypt(
			user.passwordDigest!,
			process.env.PASS!
		).toString(CryptoJS.enc.Utf8);
		if (decryptedPassword !== password) {
			res.status(401).json({
				message: "ユーザー名かパスワードが無効です。",
			});
			return;
		}

		const token = jsonwebtoken.sign({ id: user.id }, process.env.TOKEN!, {
			expiresIn: "24h",
		});
		res.status(201).json({ user, token });
	} catch (err) {
		res.status(500).json(err);
	}
};
