import express from "express";
import authRouter from "./auth";
import noteRouter from "./note";

const router = express.Router();

/* GET home page. */
router.use("/auth", authRouter);
router.use("/note", noteRouter);

export default router;
