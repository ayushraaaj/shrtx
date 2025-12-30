import mongoose from "mongoose";
import { IUrl } from "../interfaces/IUrl";

const urlSchema = new mongoose.Schema<IUrl>(
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
            required: true,
            index: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        qrGenerated: {
            type: Boolean,
            default: false,
        },
        qrGeneratedAt: Date,
    },
    { timestamps: true }
);

urlSchema.index({ owner: 1, createdAt: -1 });

export const Url = mongoose.model<IUrl>("urls", urlSchema);
