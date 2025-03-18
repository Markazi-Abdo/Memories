import express from "express";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { deleteNotif, deleteOneNotif, getNotifs } from "../controllers/notif.controller.js";
const notifRouter = express.Router();

notifRouter.get("/getnotifs", checkUser, getNotifs);
notifRouter.delete("/deletenotifs", checkUser, deleteNotif);
notifRouter.delete("/deletenotif/:id", checkUser, deleteOneNotif);

export default notifRouter