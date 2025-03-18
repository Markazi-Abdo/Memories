import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import Post from "../models/post.model.js";
import Notification from "../models/notifications.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const createPost = async ( req, res ) => {
    serverLogger.info("Postings started");
    try {
        const { text } = req.body;
        let { image } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ success: false, message: "Couldn't find user"});
        }

        if(!image && !text){
            return res.status(404).json({ success: false, message: "One of the fields shouldn't be empty" });
        }

        if(image){
            const uploader = await cloudinary.uploader.upload(image);
            image =  uploader.secure_url;
        }

        const post = new Post({
            user: user._id,
            text,
            image
        })

        const action = await post.save();
        res.status(201).json({ success: true, message:`${user.username} posted`, actionData: action });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } finally {
        serverLogger.info("Posting ended");
    }
}

export const deletePost = async ( req, res ) => {
    serverLogger.info(`${req.user.username} is deleting`);
    try {
        const { id:post } = req.params;
        const user = req.user._id;
        const findUserById = await User.findById(user);
        if(!findUserById){
            return res.status(400).json({ success: false, message: "Couldn't find user" });
        }

        const findPost = await Post.findById(post);
        if(!findPost){
            return res.status(404).json({ success: false, message: "Couldn't find Post" });
        }

        if(findPost.image){
            const imgId = findPost.image.split("/").pop().split(".")[0];
            const suppressor = await cloudinary.uploader.destroy(imgId);
        }

        const action = await Post.findByIdAndDelete(post);
        res.status(200).json({ success: true, message: `${findPost.user}'post was deleted` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } finally {
        serverLogger.info("Deletion ended");
    }
}

export const commentOnPost = async ( req, res ) => {
    try {
        const { id:post } = req.params;
        const { text } = req.body;
        let { image } = req.body;
        const findPost = await Post.findById(post.toString());
        if(!findPost){
            return res.status(404).json({ success: false, message: "Couldn't find post"})
        }

        if(!text && !image){
            return res.status(404).json({ success: false, message: "One of the fields shouldn't be empty" })
        }

        if(image){
            const uploader = await cloudinary.uploader.upload(image);
            image = uploader.secure_url;
        }

        const comment = { user: req.user._id.toString(), text, image };
        findPost.comments.push(comment);
        await findPost.save();
        res.status(201).json({ success: true, message: `${req.user.username} commented on a post`, comment })
    } catch (error) {
        
    }
}  

export const likePost = async ( req, res ) => {
    try {
        const user = req.user._id;
        const { id:post } = req.params;
        const findPost = await Post.findById(post);
        if(!findPost){
            return res.statsu(404).json({ success: false, message: "Couldn't find post"})
        }

        const findLikes = findPost.likes.includes(req.user._id);
        if(findLikes){
            const action = await Post.updateOne({ _id: post}, {$pull: { likes:  user }});
            await User.updateOne({ _id: user }, { $pull: { likedPost: post }});
            const updatedLikes = findPost.likes.filter((id) => id.toString() !== user.toString());
            res.status(200).json({ success: true, message:`${req.user._id} unliked post`, data: updatedLikes });
            const notif = new Notification({
                from: user,
                to: findPost.user,
                type: "Unlike"
            })
            await notif.save()
        } else {
            const action = await Post.updateOne({ _id: post}, { $push: { likes: user }});
            await User.updateOne({ _id: user }, { $push: { likedPost: post }})
            res.status(200).json({ success: true, message: `${req.user.username} liked a post`, likes: findPost.likes });
            const notif = new Notification({
                from: user,
                to: findPost.user,
                type: "like"
            })
            await notif.save();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getPosts = async ( req, res ) => {
    try {
        const action = await Post.find().sort({ createdAt: -1 }).populate({ path: "user", select: "-password" })
        .populate({ path: "comments.user", select: "-password" });
    
        if(action.length === 0){
            return res.status(200).json({ success: true, message: "No post was found", posts: []});
        }

        res.status(200).json({ success: true, message: "Got posts succesfully", posts: action, quantity: action.length })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getLikedPosts = async ( req, res ) => {
    try {
        const { id:user } = req.params;
        const findUser = await User.findById(user);
        if(!findUser){
            return res.status(404).json({ success: false, message: "Couldn't find user" });
        }

        const action = await Post.find({ _id: { $in: findUser.likedPost }}).populate({ path: "user", select: "-password" });
        if(action.length === 0){
            return res.status(200).json({ success: true, message: `${findUser.username} hasn't liked any post`, likedPosts: [] });
        }

        res.status(200).json({ success: true, message: `Retrieve ${findUser.username}'s liked posts succesfully`, posts: action})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getFollowing = async ( req, res ) => {
    try {
        const userId = req.user._id;
        const findUser = await User.findById(userId);
        if(!findUser){
            return res.status(404).json({ success: false, message: "Couldn't find user" });
        }

        const followings = findUser.following;
        if(followings.length === 0){
            return res.status(200).json({ success: false, posts: [] ,message: "You followed nobody" });
        }
        const feedPosts = await Post.find({ user: { $in: followings }}).sort({ createdAt: -1 })
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments",
            select:"-password"
        });

        if(feedPosts.length === 0){
            return res.status(200).json({ success: true, message: "Seems like your followers hasn't posted shit"});
        }

        res.status(200).json({ success: true, message: "Posts retieval done with success", posts: feedPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getUserPosts = async ( req, res ) => {
    try {
        const { username } = req.params;
        const findUser = await User.findOne({ username:username });
        if(!findUser){
            return res.status(404).json({ success: false, message: "Couldn't find user" });
        }

        const findHisPosts = await Post.find({ user:findUser._id }).sort({ createdAt: -1 })
        .populate({ path: "user", select: "-password" });
        if(findHisPosts.length === 0){
            return res.status(200).json({ success: true, message: `${username} hasn't posted`, quantity: 0 });
        } else if(!findHisPosts){
            return res.status(404).json({ success: false, message: `Couldn't get ${username} posts`});
        }

        res.status(200).json({ success: true, message: `Succesfully got ${username}'s posts`, posts: findHisPosts, quantity: findHisPosts.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}