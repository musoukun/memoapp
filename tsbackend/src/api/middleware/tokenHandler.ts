import * as jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import env from "../../../env";

const prisma = new PrismaClient();

// クライアントから渡されたトークンが正常かの検証
const tokenDecode = (
	req: Request
): string | jsonwebtoken.JwtPayload | false => {
	// リクエストヘッダからauthorizationフィールドを指定してベアラトークンを取得する。
	const bearerHeader = req.headers["authorization"];

	if (bearerHeader) {
		// ベアラだけを取得。
		const bearer = bearerHeader.split(" ")[1];

		try {
			// ベアラと秘密鍵情報を用いてJWTの検証と読み取りを行う。
			const tokenDecoded = jsonwebtoken.verify(
				bearer,
				env.TOKEN as string
			);
			return tokenDecoded;
			// ベアラと秘密鍵が正しくない場合はfalseを返す->権限がない判定。
		} catch {
			return false;
		}
	} else {
		return false;
	}
};

// トークン認証関数(ミドルウェアとして利用)
export const verifyToken = async (
	req: Request | any,
	res: Response,
	next: NextFunction
) => {
	const tokenDecoded = tokenDecode(req);

	if (!tokenDecoded) {
		return res.status(401).json({ message: "権限がありません" });
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: (tokenDecoded as jsonwebtoken.JwtPayload).id as string,
			},
		});

		if (!user) {
			return res
				.status(401)
				.json({ message: "ユーザーが見つかりません" });
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("VerifyTokenError", err);
		return res
			.status(500)
			.json({ message: "サーバーエラーが発生しました" });
	}
};
