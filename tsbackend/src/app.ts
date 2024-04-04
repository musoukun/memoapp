import express, { Express, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import routes from "./api/routes";

const app: Express = express();
const PORT = 5000;

app.use(cors());

// 特定のオリジンのみを許可する場合の設定例;
// app.use(
// 	cors({
// 		origin: ["http://localhost:5173", "https://*.vercel.app/"],
// 	})
// );

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routes);
app.listen(PORT, () => {
	console.log("start server");
});

app.get("/", (req, res) => {
	res.send("Hello, Express server is running on port 5000!");
});
const listEndpoints = require("express-list-endpoints");
console.log(listEndpoints(app));
export default app;
