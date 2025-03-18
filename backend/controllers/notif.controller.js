import Notification from "../models/notifications.model.js";
import { User } from "../models/user.model.js";

export const getNotifs = async ( req, res ) => {
    try {
        const userId = req.user._id;
        const findUser = await User.findById(userId);
        if(!findUser){
            return res.status(404).json({ success: false, message: "Couldn't find user" });
        }

        const getNotifications = await Notification.find({ to: userId }).sort({ createdAt: -1 })
        .populate({ path: "from", select: "-password" });
        if(!getNotifications){
            return res.status(404).json({ success: false, message: "Couldn't get notifications" });
        } else if (getNotifications.length === 0){
            return res.status(200).json({ success: true, message: "No notifications", notifications: [] });
        }
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json({ success: true, message: "Notifications ready", notifications: getNotifications, quantity: getNotifications.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteNotif = async ( req, res ) => {
    try {
        const userId = req.user._id;
        const findNotifs = await Notification.find({ to: userId });
        if(!findNotifs){
            return res.status(404).json({ success: false, message: "Couldn't get notifications" });
        }
        const action = await Notification.deleteMany({ to: userId });
        res.status(200).json({ success: true, message: "Deletion succesfull" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteOneNotif = async ( req, res ) => {
    try {
        const { id:notif } = req.params;
        const user = req.user._id;

        const findUser = await User.findById(user);
        if(!findUser){
            return res.status(404).json({ success: false, message: "Couldn't find user" })
        }

        const findNotif = await Notification.findById(notif);
        if(!findNotif){
            return res.status(404).json({ success: false, message: "Couldn't find notification" })
        }

        const check = await Notification.find({ _id: notif.toString() },{ to: user.toString() });
        if(!check){
            return res.status(404).json({ success: false, message: "Not user's notification."})
        }
        const action = await Notification.findByIdAndDelete(notif);
        res.status(200).json({ success: true, message: `${findUser.username} deleted a notification`})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
    
}