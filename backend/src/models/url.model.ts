import mongoose from "mongoose";
import { IUrl } from "../interfaces/IUrl";
import bcrypt from "bcrypt";

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
        isActive: {
            type: Boolean,
            default: true,
        },
        refs: [
            {
                source: {
                    type: String,
                    required: true,
                },
                clicks: {
                    type: Number,
                    default: 0,
                },
                createdAt: Date,
            },
        ],
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            default: undefined,
        },
        expiration: {
            type: Date,
        },
        limit: {
            type: Number,
        },
        notes: {
            type: String,
        },
        password: {
            type: String,
        },
    },
    { timestamps: true },
);

urlSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    if (!this.password) {
        this.password = null;
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

urlSchema.methods.isPasswordValid = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

urlSchema.index({ owner: 1, createdAt: -1 });

export const Url = mongoose.model<IUrl>("urls", urlSchema);
