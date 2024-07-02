import express, { Express, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import routes from "./api/routes";
import env from "../env";

const app: Express = express();
const PORT = env.PORT;

app.use(cors());

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send(`Hello, Express server is running on port ${PORT}`);
});

app.use("/api", routes);

app.listen(PORT, () => {
	console.log(`start server ${PORT}`);
});

// const listEndpoints = require("express-list-endpoints");
// console.log(listEndpoints(app));

export default app;
