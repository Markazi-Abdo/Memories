import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["follow", "like", "unfollow", "Unlike"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationsSchema);
export default Notification