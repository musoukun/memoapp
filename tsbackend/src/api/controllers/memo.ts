/* eslint-disable prefer-const */
import { Memo, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import { CustomRequest } from "../types/memo";
import { MemoPositionUpdateBody } from "../types/memo";

export const test = async (req: Request, res: Response) => {
	res.send("memoAPI test");
};

export const create = async (
	req: CustomRequest<{ position: number }>,
	res: Response
) => {
	try {
		const memoCount = await prisma.memo.count();
		const memo = await prisma.memo.create({
			data: {
				userId: req.user!.id,
				position: memoCount,
			},
		});
		res.status(201).json(memo);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const getAll = async (req: CustomRequest<{}>, res: Response) => {
	try {
		const memos = await prisma.memo.findMany({
			where: { userId: req.user!.id },
			orderBy: { position: "asc" },
		});
		res.status(200).json(memos);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const updatePosition = async (
	req: CustomRequest<MemoPositionUpdateBody>,
	res: Response
) => {
	const { memos } = req.body as MemoPositionUpdateBody;
	try {
		await Promise.all(
			memos.reverse().map((memo, index) =>
				prisma.memo.update({
					where: { id: memo.id },
					data: { position: index },
				})
			)
		);
		res.status(200).json("更新しました");
	} catch (err) {
		res.status(500).json(err);
	}
};

export const getOne = async (req: CustomRequest<{}>, res: Response) => {
	const memoId = req.params.memoId!;
	try {
		const memo = await prisma.memo.findUnique({
			where: { id: memoId, userId: req.user!.id },
		});
		if (!memo) return res.status(404).json("メモが存在しません");
		res.status(200).json(memo);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const update = async (req: CustomRequest<Memo>, res: Response) => {
	const memoId = req.params.memoId!;
	let { title, description, favorite } = req.body as Memo;

	title = title === "" ? "無題" : title;
	description =
		description === "" ? "ここに自由に記入してください" : description;

	try {
		// 現在のメモを取得
		const currentMemo = await prisma.memo.findUnique({
			where: { id: memoId },
		});

		if (!currentMemo) {
			return res.status(404).json("メモが存在しません");
		}

		// メモの内容を更新
		const updatedMemo = await prisma.memo.update({
			where: { id: memoId },
			data: {
				title,
				description,
				favorite,
				favoritePosition: favorite ? req.body.favoritePosition : 0,
			},
		});

		res.status(200).json(updatedMemo);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

export const getFavorites = async (req: CustomRequest<{}>, res: Response) => {
	try {
		const favorites = await prisma.memo.findMany({
			where: { userId: req.user!.id, favorite: true },
			orderBy: { favoritePosition: "desc" },
		});
		res.status(200).json(favorites);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const deleteMemo = async (req: CustomRequest<{}>, res: Response) => {
	const memoId = req.params.memoId!;
	try {
		await prisma.memo.delete({
			where: { id: memoId },
		});
		res.status(200).json("メモを削除しました");
	} catch (err) {
		res.status(500).json(err);
	}
};
