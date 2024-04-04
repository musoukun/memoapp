/* eslint-disable prefer-const */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const test = async (req, res) => {
	res.send("memoAPI test");
};

export const create = async (req, res) => {
	try {
		const memoCount = await prisma.memo.count();
		const memo = await prisma.memo.create({
			data: {
				userId: req.user.id, // PrismaではuserIdを使用します
				position: memoCount,
			},
		});
		res.status(201).json(memo);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const getAll = async (req, res) => {
	try {
		const memos = await prisma.memo.findMany({
			where: { userId: req.user.id },
			orderBy: { position: "desc" },
		});
		res.status(200).json(memos);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const updatePosition = async (req, res) => {
	const { memos } = req.body;
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

export const getOne = async (req, res) => {
	const memoId = req.params.memoId;
	try {
		const memo = await prisma.memo.findUnique({
			where: { id: memoId, userId: req.user.id },
		});
		if (!memo) return res.status(404).json("メモが存在しません");
		res.status(200).json(memo);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const update = async (req, res) => {
	const memoId = req.params.memoId;
	let { title, description, favorite } = req.body;

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

		// お気に入りの更新がある場合、お気に入りの位置を更新する
		if (favorite !== undefined && currentMemo.favorite !== favorite) {
			// 現在のメモ以外でお気に入りされているメモを取得
			const favorites = await prisma.memo.findMany({
				where: {
					userId: currentMemo.userId,
					favorite: true,
					NOT: { id: memoId },
				},
			});

			// お気に入りに追加する場合、最後の位置に追加
			if (favorite) {
				req.body.favoritePosition = favorites.length;
			} else {
				// お気に入りから削除する場合、他のお気に入りの位置を更新
				await Promise.all(
					favorites.map((memo, index) =>
						prisma.memo.update({
							where: { id: memo.id },
							data: { favoritePosition: index },
						})
					)
				);
			}
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

export const getFavorites = async (req, res) => {
	try {
		const favorites = await prisma.memo.findMany({
			where: { userId: req.user.id, favorite: true },
			orderBy: { favoritePosition: "desc" },
		});
		res.status(200).json(favorites);
	} catch (err) {
		res.status(500).json(err);
	}
};

export const deleteMemo = async (req, res) => {
	const memoId = req.params.memoId;
	try {
		await prisma.memo.delete({
			where: { id: memoId },
		});
		res.status(200).json("メモを削除しました");
	} catch (err) {
		res.status(500).json(err);
	}
};
