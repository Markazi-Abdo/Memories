import express from "express"
import { followToggle, getSuggestions, getUser, updateProfile } from "../controllers/users.controller.js";
import { checkUser } from "../middleware/checkUser.middleware.js";
const userRouter = express.Router();

userRouter.get('/profile/:username', checkUser, getUser);
userRouter.get('/suggestions', checkUser, getSuggestions);
userRouter.post('/follow/:id', checkUser, followToggle);
userRouter.put('/update', checkUser, updateProfile);

export default userRouter;