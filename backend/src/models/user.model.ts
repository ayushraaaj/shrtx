import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.types";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: [true, "Username must be unique"],
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email must be unique"],
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: [true, "Fullname is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
        emailVerificationExpiry: Date,
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
        refreshToken: String,
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("users", userSchema);
