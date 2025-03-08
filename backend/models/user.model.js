import mongoose, { model } from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }, 
    password: {
        type: String,
        required: true,
    },
    profilePic :{
        type: String
    },
    coverPic: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);