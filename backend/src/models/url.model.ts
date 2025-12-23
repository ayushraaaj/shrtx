import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        shortCode: {
            type: String,
            required: true,
            unique: true,
        },
        originalUrl: {
            type: String,
            required: [true, "Original url is required"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        clicks: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Url = mongoose.model("urls", urlSchema);
