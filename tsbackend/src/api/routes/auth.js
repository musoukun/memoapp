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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validation = __importStar(require("../handlers/validation"));
const userController = __importStar(require("../controllers/user"));
const tokenHandler = __importStar(require("../handlers/tokenHandler"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/test", userController.test);
// ユーザー新規登録用API
router.post("/register", (0, express_validator_1.body)("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります。"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります。"), (0, express_validator_1.body)("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは8文字以上である必要があります。"), (0, express_validator_1.body)("username").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { username: value },
    });
    if (user) {
        return Promise.reject("このユーザー名はすでに使われています。");
    }
})), validation.validate, userController.register);
// ログイン用API
router.post("/login", (0, express_validator_1.body)("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります。"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります。"), validation.validate, userController.login);
// トークン認証API
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
    res.status(200).json({ user: req.user });
});
exports.default = router;
