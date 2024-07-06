import express from "express";
import authRouter from "./auth";
import noteRouter from "./note";
import kanbanRouter from "./kanban";

const router = express.Router();

/* GET home page. */
router.use("/auth", authRouter);
router.use("/note", noteRouter);
router.use("/kanban", kanbanRouter);

export default router;
