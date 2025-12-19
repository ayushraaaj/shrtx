import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, fullname, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    const user = new User(req.body);
    await user.save();

    const createdUser = await User.findById(user._id).select(
        "-password -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
        .status(201)
        .json(new ApiResponse("Signup successful", createdUser));
});
