import express from "express"
import { checkUser } from "../middleware/checkUser.middleware.js";
import { commentOnPost, createPost, deletePost, getFollowing, getLikedPosts, getPosts, getUserPosts, likePost } from "../controllers/post.controller.js";
const postRoutes = express.Router();

postRoutes.get("/all", checkUser, getPosts);
postRoutes.get("/following", checkUser, getFollowing)
postRoutes.get("/likedposts/:id", checkUser, getLikedPosts)
postRoutes.get("/userposts/:username", checkUser, getUserPosts)
postRoutes.post("/createpost", checkUser, createPost);
postRoutes.delete("/deletepost/:id", checkUser, deletePost);
postRoutes.post("/comment/:id", checkUser, commentOnPost);
postRoutes.post("/like/:id", checkUser, likePost);

export default postRoutes;