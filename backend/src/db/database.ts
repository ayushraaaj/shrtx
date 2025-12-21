import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { MONGO_URI } from "../config/env";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        throw new ApiError(500, "Failed to connect to MongoDB");
    }
};

export default connectDB;
