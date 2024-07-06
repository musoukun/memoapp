import { Request } from "express";

interface User {
	id: string;
	name: string;
	// 他のユーザー情報のフィールド...
}

declare module "express-serve-static-core" {
	interface Request {
		user?: User;
	}
}
