import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import crypto from "crypto";
import {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail,
} from "../utils/mail";
import { IUser } from "../interfaces/IUser";
import { CLIENT_URL, REFRESH_TOKEN_SECRET } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user: IUser) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while login");
    }
};

const generateVerificationToken = () => {
    // randomBytes(5) → generates 5 bytes
    // Each byte becomes 2 hex characters
    // 5 × 2 = 10 characters

    const token = crypto.randomBytes(15).toString("hex");
    return token;
};

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, fullname, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    const user = await User.create({ username, email, fullname, password });

    const hashedToken = generateVerificationToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.fullname,
            `${CLIENT_URL}/verifyemail/${hashedToken}`,
        ),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry -refreshToken",
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
        .status(201)
        .json(new ApiResponse("Signup successful", createdUser));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { username_email, password } = req.body;

    const user = await User.findOne({
        $or: [{ username: username_email }, { email: username_email }],
    });

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordValid(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user);

    const loggedInUser = await User.findById(user._id).select(
        "-password -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/api/v1/auth/refresh-token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res.status(200).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse("Login successful", {
            loggedInUser,
            accessToken,
        }),
    );
});

export const verifyUserEmail = asyncHandler(
    async (req: Request, res: Response) => {
        const { token } = req.body;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpiry: { $gt: Date.now() },
        });

        if (!user) {
            throw new ApiError(401, "Verification token is invalid or expired");
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse("Email successfully verified", {}));
    },
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    await User.findByIdAndUpdate(userId, { $set: { refreshToken: undefined } });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        maxAge: 0,
        path: "/api/v1/auth/refresh-token",
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse("Logout successful", {}));
});

export const authMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    return res.status(200).json(new ApiResponse("User authenticated", {}));
});

export const forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "Email does not exist");
        }

        const hashedToken = generateVerificationToken();

        user.forgotPasswordToken = hashedToken;
        user.forgotPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        await sendEmail({
            email: user.email,
            subject: "Reset you password",
            mailgenContent: forgotPasswordMailgenContent(
                user.fullname,
                `${CLIENT_URL}/forgot-password/${hashedToken}`,
            ),
        });

        return res
            .status(200)
            .json(new ApiResponse("Forgot password email is sent", {}));
    },
);

export const setForgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { token, password } = req.body;

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            throw new ApiError(
                401,
                "Forgot password token is invalid or expired",
            );
        }

        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();

        return res
            .status(200)
            .json(new ApiResponse("Password reset successful", {}));
    },
);

export const refreshToken = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new ApiError(401, "Refresh token is missing");
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(
                refreshToken,
                REFRESH_TOKEN_SECRET,
            ) as JwtPayload;
        } catch (error) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const user = await User.findById(decodedToken?._id);
        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            path: "/api/v1/auth/refresh-token",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse("Access token refreshed", {
                    newAccessToken,
                }),
            );
    },
);
