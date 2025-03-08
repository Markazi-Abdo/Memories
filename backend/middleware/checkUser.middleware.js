import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const checkUser = async (req, res, next) => {
    serverLogger.info("Auth Started");
    try {
        const cookie = req.cookies.user_token;
        if(!cookie){
            return res.status(400).json({ success: false, message: "Invalid cookie"})
        }

        const decoded = jwt.verify(cookie, process.env.TOKEN_KEY);
        if(!decoded){
            return res.status(400).json({ success: false, message: "Token unverified"});
        }

        const user = await User.findOne({ _id: decoded.id }).select("-password");
        if(!user){
            return res.status(400).json({ success: false, message: "Couldn't find user"});
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        serverLogger.info("Auth Finished");
    }
    
}