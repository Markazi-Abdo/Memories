import jwt from "jsonwebtoken";
import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (id, res) => {
    serverLogger.info("Token generation started");
    if(!id) {
        serverLogger.info("Cound't generate token due to invalid or empty given value of ID");
        return;
    }

    const token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "30d"});
    res.cookie("user_token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });

    serverLogger.info("Generation succeeded");
    return token;
}