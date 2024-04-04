import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

const prisma = new PrismaClient();

// バリデーション
export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// ObjectIdが有効かどうか
export const isObjectId = async (value: string): Promise<boolean> => {
	const record = await prisma.memo.findUnique({
		where: { id: value },
	});
	return !!record;
};
