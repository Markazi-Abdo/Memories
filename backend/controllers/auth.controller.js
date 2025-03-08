import { dbLogger } from "../logs/funcs/dbLog.log.js";
import { serverLogger } from "../logs/funcs/serverLogger.log.js";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/token.js";

export const signUpController = async (req, res) => {
    serverLogger.info("Signing up started");
    const userReq = req.body;
    try {
    if(!userReq.username || !userReq.email || !userReq.password){
        dbLogger.info("Couldn't proceed due to empty fields");
        res.status(400).json({ success: false, message: "All fields should be filled "});
        return;
    }

    const findEmail = await User.findOne({ email: userReq.email });
    if(findEmail){
        dbLogger.info("Couldn't procced due to already existing email"); 
        res.status(400).json({ success: false, message: "Email Already exists "});
        return;
    }

    const salt = await bcryptjs.genSalt(30);
    const hashed = await bcryptjs.hash(userReq.password, salt);

    const newUser = new User({
        username: userReq.username,
        email: userReq.email,
        password: hashed
    })

    if(newUser) {
        generateToken(newUser._id, res);
        const action = await newUser.save();
        dbLogger.info(`${newUser.username} signed Up succesfully`);
        return res.status(201).json({ success: true, message: `${newUser.username} signed Up succesfully`, actionData: newUser });
    }
    
    } catch (error) {
        serverLogger.info("Failed SignUp...");
        res.status(500).json({ success: false, message: error.message});
    } finally {
        serverLogger.info("SigningUp Ended");
    }
};

export const loginController = async (req, res) => {
    serverLogger.info("Logging in started");
    const userReq = req.body;
    try {
        if(!userReq.email || !userReq.password){
            serverLogger.info("Fields should be filled");
            return res.status(400).json({ success: false, message: "Fields should be filled"});
        }

        const findEmail = await User.findOne({ email: userReq.email });
        const findPass = await bcryptjs.compare(userReq.password, findEmail.password);

        if(!findEmail || !findPass){
            serverLogger.info("Couldn't proceed due to invalid credentials");
            return res.status(400).json({ success: false, message: "Couldn't proceed due to invalid credentials"});
        }

        generateToken(findEmail._id, res);
        return res.status(200).json({ success: true, message: `${findEmail.username} successfully logged in `, authData: {
            _id: findEmail._id,
            username: findEmail.username,
            email: findEmail.email
        }})        

    } catch (error) {
        res.status(500).json({ success: false, meesage: error.message });
    } finally {
        serverLogger.info("Logging in ended");
    }
};

export const logoutController = (req, res) => {
    serverLogger.info("Logout started");
    try {
        res.cookies("user_token", "", { maxAge: 0 });
        serverLogger.info("Logout successfull"); 
        return res.status(200).json({ success: true, message: "Logout succesfull"});
    } catch (error) {
        serverLogger.info(error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        serverLogger.info("Logout finished");
    }
    
};