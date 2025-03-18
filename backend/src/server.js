import express from "express";
import dotenv from "dotenv"
import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import { connectToDb } from "../utils/connect.js";
import { User } from "../models/user.model.js";
import  Notification  from "../models/notifications.model.js";
import Post from "../models/post.model.js";
import authRoutes from "../routes/authRoutes.routes.js";
import cors from 'cors';
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import http from "http";
import userRouter from "../routes/users.routes.js";
import postRoutes from "../routes/post.routes.js";
import notifRouter from "../routes/notifications.routes.js";
import path from "path";
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use("/memories/auth", authRoutes);
app.use("/memories/user", userRouter);
app.use("/memories/posts", postRoutes);
app.use("/memories/notifs", notifRouter);

serverNamespace.on("connection", (socket) => {
    serverLogger.info("User connected", socket.id);

    socket.on("disconnect", () => {
        serverLogger.info("User disconnected", socket.id);
    })
})

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
})

server.listen(process.env.PORT, () => {
    serverLogger.info("Server Running on " + process.env.PORT);
    connectToDb(process.env.MONGO_DB_URI);
});
