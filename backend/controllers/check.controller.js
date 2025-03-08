import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import { User } from "../models/user.model.js"

export const authCheck = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id).select("-password");
        res.status(200).json({ success: true, message: "User authnetic", data: authUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        serverLogger.info("User authentic");
    }
}