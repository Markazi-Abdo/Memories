import express from "express";
import dotenv from "dotenv"
import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import { connectToDb } from "../utils/connect.js";
import { User } from "../models/user.model.js";
import authRoutes from "../routes/authRoutes.routes.js";
import cors from 'cors';
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import http from "http";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});
export const serverNamespace = io.of("/memories");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use("/memories", authRoutes);

serverNamespace.on("connection", (socket) => {
    serverLogger.info("User connected", socket.id);

    socket.on("disconnect", () => {
        serverLogger.info("User disconnected", socket.id);
    })
})

server.listen(process.env.PORT, () => {
    serverLogger.info("Server Running on " + process.env.PORT);
    connectToDb(process.env.MONGO_DB_URI);
});
