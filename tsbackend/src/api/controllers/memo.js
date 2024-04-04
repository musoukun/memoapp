"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemo = exports.getFavorites = exports.update = exports.getOne = exports.updatePosition = exports.getAll = exports.create = exports.test = void 0;
/* eslint-disable prefer-const */
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("memoAPI test");
});
exports.test = test;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memoCount = yield prisma.memo.count();
        const memo = yield prisma.memo.create({
            data: {
                userId: req.user.id, // PrismaではuserIdを使用します
                position: memoCount,
            },
        });
        res.status(201).json(memo);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memos = yield prisma.memo.findMany({
            where: { userId: req.user.id },
            orderBy: { position: "desc" },
        });
        res.status(200).json(memos);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getAll = getAll;
const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { memos } = req.body;
    try {
        yield Promise.all(memos.reverse().map((memo, index) => prisma.memo.update({
            where: { id: memo.id },
            data: { position: index },
        })));
        res.status(200).json("更新しました");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.updatePosition = updatePosition;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memoId = req.params.memoId;
    try {
        const memo = yield prisma.memo.findUnique({
            where: { id: memoId, userId: req.user.id },
        });
        if (!memo)
            return res.status(404).json("メモが存在しません");
        res.status(200).json(memo);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getOne = getOne;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memoId = req.params.memoId;
    let { title, description, favorite } = req.body;
    title = title === "" ? "無題" : title;
    description =
        description === "" ? "ここに自由に記入してください" : description;
    try {
        // 現在のメモを取得
        const currentMemo = yield prisma.memo.findUnique({
            where: { id: memoId },
        });
        if (!currentMemo) {
            return res.status(404).json("メモが存在しません");
        }
        // お気に入りの更新がある場合、お気に入りの位置を更新する
        if (favorite !== undefined && currentMemo.favorite !== favorite) {
            // 現在のメモ以外でお気に入りされているメモを取得
            const favorites = yield prisma.memo.findMany({
                where: {
                    userId: currentMemo.userId,
                    favorite: true,
                    NOT: { id: memoId },
                },
            });
            // お気に入りに追加する場合、最後の位置に追加
            if (favorite) {
                req.body.favoritePosition = favorites.length;
            }
            else {
                // お気に入りから削除する場合、他のお気に入りの位置を更新
                yield Promise.all(favorites.map((memo, index) => prisma.memo.update({
                    where: { id: memo.id },
                    data: { favoritePosition: index },
                })));
            }
        }
        // メモの内容を更新
        const updatedMemo = yield prisma.memo.update({
            where: { id: memoId },
            data: {
                title,
                description,
                favorite,
                favoritePosition: favorite ? req.body.favoritePosition : 0,
            },
        });
        res.status(200).json(updatedMemo);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});
exports.update = update;
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favorites = yield prisma.memo.findMany({
            where: { userId: req.user.id, favorite: true },
            orderBy: { favoritePosition: "desc" },
        });
        res.status(200).json(favorites);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getFavorites = getFavorites;
const deleteMemo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memoId = req.params.memoId;
    try {
        yield prisma.memo.delete({
            where: { id: memoId },
        });
        res.status(200).json("メモを削除しました");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.deleteMemo = deleteMemo;
