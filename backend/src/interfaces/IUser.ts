import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    fullname: string;
    password: string;
    isAdmin: boolean;
    isEmailVerified: boolean;
    notificationsAllowed: boolean;
    
    emailVerificationToken?: string | null;
    emailVerificationExpiry?: Date | null;
    forgotPasswordToken?: string | null;
    forgotPasswordExpiry?: Date | null;
    refreshToken?: string | null;

    isPasswordValid(password: string): Promise<boolean>;

    generateAccessToken(): string;
    generateRefreshToken(): string;
}
