import express from "express"
import { loginController, logoutController, signUpController } from "../controllers/auth.controller.js";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { authCheck } from "../controllers/check.controller.js";
const authRoutes = express.Router();

authRoutes.post("/signup", signUpController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/authuser", checkUser, authCheck);

export default authRoutes;