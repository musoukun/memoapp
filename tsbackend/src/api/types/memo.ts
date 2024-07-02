import exp from "constants";
import { Memo } from "@prisma/client";
import { Prisma } from "@prisma/client";

type MemoPositionUpdateBody = {
	memos: { id: string }[];
};

interface CustomRequest<T> {
	user?: { id: string };
	body: T | Memo;
	params: { memoId?: string };
}

export type { MemoPositionUpdateBody, CustomRequest };
