import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type:String
    },
    image:{
        type:String
    },
    likes:[{
        type:mongoose.Types.ObjectId,
        ref:"User",
    }],
    comments:[{
        text: {
            type: String
        },
        image: {
            type:String
        },
        user: {
            type:mongoose.Types.ObjectId,
            required: true,
            ref:"User"
        }
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;