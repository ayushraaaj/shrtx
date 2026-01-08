import mongoose, { Schema } from "mongoose";
import { IGroup } from "../interfaces/IGroup";

const groupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: [true, "Enter a group name"],
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

groupSchema.index({ owner: 1, createdAt: -1 });

export const Group = mongoose.model("groups", groupSchema);
