import express from "express";
import dotenv from "dotenv"
import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import { connectToDb } from "../utils/connect.js";
import { User } from "../models/user.model.js";
import authRoutes from "../routes/authRoutes.routes.js";
import cors from 'cors';
import cookieParser from "cookie-parser"
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/memories", authRoutes);

app.listen(process.env.PORT, () => {
    serverLogger.info("Server Running on " + process.env.PORT);
    connectToDb(process.env.MONGO_DB_URI);
});
