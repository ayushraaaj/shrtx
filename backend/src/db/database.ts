import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new ApiError(500, "MONGO_URI is not defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        throw new ApiError(500, "Failed to connect to MongoDB");
    }
};

export default connectDB;
