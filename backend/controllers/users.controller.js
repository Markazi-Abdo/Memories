import { serverLogger } from "../logs/funcs/serverLogger.log.js"
import { User } from "../models/user.model.js";
import Notification from "../models/notifications.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js" 
import { dbLogger } from "../logs/funcs/dbLog.log.js";

export const getUser = async (req, res) => {
    serverLogger.info("Getting user Profile");
    const { username } = req.params;
    try {
        const findUser = await User.findOne({ username }).select("-password");
        if(!findUser){
            return res.status(404).json({ succcess: false, message: "User not found... :(" });
        }

        res.status(200).json({ success: true, message: `Succesfully found ${username} data`, profileData: findUser });
        serverLogger.info("Data retireval was done succesfully");

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } finally {
        serverLogger.info("User's data retrieval is finished");
    }
}

export const getSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                },
            },{
                $sample:{ size: 10 }
            }
        ]);

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach(user => user.password = null);

        res.status(200).json({ success: true, message: "Suugestions stored succesfully", data: suggestedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } finally {
        serverLogger.info("Suugestion action finished");
    }
}

export const followToggle = async (req, res) => {
    const { id } = req.params;
    const userToToggle =  await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    try {
        if(id === currentUser._id.toString()){
            return res.status(404).json({ success: false, message: "Can't follow urself"});
        }
    
        if(!userToToggle || !currentUser){
            return res.status(404).json({ success: false, message: "Credentials weren't found.."});
        }
        
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id }});
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id }});
            const notif = new Notification({
                from: currentUser._id,
                to: userToToggle._id,
                type: "unfollow",
            })
            await notif.save();
            res.status(200).json({ success: true, message: `${currentUser.username} unfollowed ${userToToggle.username}`, userId: userToToggle._id });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            const notif = new Notification({
                from: currentUser._id,
                to: userToToggle._id,
                type: "follow",
            })
            await notif.save();
            res.status(200).json({ success: true, message: `${currentUser.username} followed ${userToToggle.username}`, userId: userToToggle._id });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } finally {
        serverLogger.info("Following api finished");
    }
    
}

export const updateProfile = async (req, res) => {
    serverLogger.info("Updating started, getting body values");
    const { username, email, currentPassword, newPassword, bio, link } = req.body;
    dbLogger.info(req.body);
    let { profilePic, coverPic } = req.body;
    try {
        let user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ success: false, message: "Id invalid" });

        if( (!currentPassword && newPassword) || ( currentPassword && !newPassword ) ){
            return res.status(400).json({ success: false, message: "Fields should be filled"});
        }

        if( currentPassword && newPassword ){
            const comparePass = await bcrypt.compare( currentPassword, user.password );
            if( !comparePass )  return res.status(400).json({ success: false, message: "Password Incorrect" });
            if( newPassword.length < 6 ) return res.status(400).json({ success: false, message: "Password should be over 6 chars"});

            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(newPassword, salt);
            newPassword = newHash;
        }

        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedImg = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedImg.secure_url;
        }
        if(coverPic){
            if(user.coverPic){
                await cloudinary.uploader.destroy(user.coverPic.split("/").pop().split(".")[0]);
            }
            const uploadedCvr = await cloudinary.uploader.upload(coverPic);
            coverPic = uploadedCvr.secure_url
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.link = link || user.link;
        user.bio = bio || user.bio;
        user.password = newPassword || user.password;
        user.profilePic = profilePic || user.profilePic;
        user.coverPic = coverPic || user.coverPic;

        user = await user.save();
        user.password = null;
        
        return res.status(201).json({ success: true, message: `${username} updated succesfully`, newData: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    } finally {
        serverLogger.info("Updating finished");
    }
}