import express from "express"
import { loginController, logoutController, signUpController } from "../controllers/auth.controller.js";
const authRoutes = express.Router();

authRoutes.post("/signup", signUpController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);

export default authRoutes;