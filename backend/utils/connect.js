import mongoose from "mongoose"
import { serverLogger } from "../logs/funcs/serverLogger.log.js"
import { dbLogger } from "../logs/funcs/dbLog.log.js";

export const connectToDb = async (uri) => {
    serverLogger.info("Connection to DB");
    try {
        await mongoose.connect(uri);
        dbLogger.info("Connection succesfull");
    } catch (error) {
        serverLogger.info("Coonection failed");
        process.exit(1);
    } finally {
        serverLogger.info("Conection action ended");
    }
}