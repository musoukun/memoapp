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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.test = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("authAPI test");
});
exports.test = test;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    console.log(password);
    try {
        const encryptedPassword = crypto_js_1.default.AES.encrypt(password, process.env.PASS).toString();
        console.log(encryptedPassword);
        const user = yield prisma.user.create({
            data: {
                username: req.body.username,
                passwordDigest: encryptedPassword,
            },
        });
        console.log(user);
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN, {
            expiresIn: "24h",
        });
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = yield prisma.user.findUnique({
            where: { username: username },
        });
        if (!user) {
            res.status(401).json({
                message: "ユーザー名かパスワードが無効です。",
            });
            return;
        }
        const decryptedPassword = crypto_js_1.default.AES.decrypt(user.passwordDigest, process.env.PASS).toString(crypto_js_1.default.enc.Utf8);
        if (decryptedPassword !== password) {
            res.status(401).json({
                message: "ユーザー名かパスワードが無効です。",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN, {
            expiresIn: "24h",
        });
        res.status(201).json({ user, token });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.login = login;
