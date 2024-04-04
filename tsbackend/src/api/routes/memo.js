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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memoController = __importStar(require("../controllers/memo"));
const tokenHandler = __importStar(require("../handlers/tokenHandler"));
const express_validator_1 = require("express-validator");
const validation = __importStar(require("../handlers/validation"));
const router = (0, express_1.Router)();
router.get("/test", memoController.test);
//📝を作成
router.post("/", tokenHandler.verifyToken, memoController.create);
//📝を取得
router.get("/", tokenHandler.verifyToken, memoController.getAll);
router.put("/", tokenHandler.verifyToken, memoController.updatePosition);
router.get("/favorites", tokenHandler.verifyToken, memoController.getFavorites);
router.get("/:memoId", (0, express_validator_1.param)("memoId").custom((value) => {
    if (!validation.isObjectId(value)) {
        return Promise.reject("無効なIDです。");
    }
    else
        return Promise.resolve();
}), validation.validate, tokenHandler.verifyToken, memoController.getOne);
router.put("/:memoId", (0, express_validator_1.param)("memoId").custom((value) => {
    if (!validation.isObjectId(value)) {
        return Promise.reject("無効なIDです。");
    }
    else
        return Promise.resolve();
}), validation.validate, tokenHandler.verifyToken, memoController.update);
router.delete("/:memoId", (0, express_validator_1.param)("memoId").custom((value) => {
    if (!validation.isObjectId(value)) {
        return Promise.reject("無効なIDです。");
    }
    else
        return Promise.resolve();
}), validation.validate, tokenHandler.verifyToken, memoController.deleteMemo);
exports.default = router;
