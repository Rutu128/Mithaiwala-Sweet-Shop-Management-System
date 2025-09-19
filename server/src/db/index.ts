import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {

        await mongoose.connect(`${process.env.MONGO_URI}/main` || "");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}


export const testConnectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI_TEST}/test` || "");
        console.log("Connected to MongoDB Test Database");
    } catch (error) {
        console.log(error);
    }
}
