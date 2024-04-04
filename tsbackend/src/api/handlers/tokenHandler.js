"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyToken = void 0;
const jsonwebtoken = __importStar(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// クライアントから渡されたトークンが正常かの検証
const tokenDecode = (req) => {
    // リクエストヘッダからauthorizationフィールドを指定してベアラトークンを取得する。
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        // ベアラだけを取得。
        const bearer = bearerHeader.split(" ")[1];
        try {
            // ベアラと秘密鍵情報を用いてJWTの検証と読み取りを行う。
            const tokenDecoded = jsonwebtoken.verify(bearer, process.env.TOKEN);
            return tokenDecoded;
            // ベアラと秘密鍵が正しくない場合はfalseを返す->権限がない判定。
        }
        catch (_a) {
            return false;
        }
    }
    else {
        return false;
    }
};
// トークン認証関数(ミドルウェアとして利用)
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDecoded = tokenDecode(req);
    console.log(tokenDecoded);
    // デコード済みのトークンがあれば(=以前ログインor新規作成されたユーザーであれば)
    if (tokenDecoded) {
        // そのトークンと一致するユーザーを探してくる。
        console.log(tokenDecoded.id);
        const user = yield prisma.user.findUnique({
            where: {
                id: tokenDecoded.id,
            },
        });
        if (!user)
            return res.status(401).json("権限がありません");
        req.user = user;
        next();
    }
    else {
        res.status(401).json("権限がありません");
    }
});
exports.verifyToken = verifyToken;
