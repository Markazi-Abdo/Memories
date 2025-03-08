import mongoose, { model } from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    }, 
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    followers:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    },
    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    },
    profilePic :{
        type: String,
        default: "",
    },
    coverPic: {
        type: String,
        default: "",
    }, 
    bio: {
        type: String,
        default: "",
    },
    link : {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);