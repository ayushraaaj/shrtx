export interface IUser extends Document {
    username: string;
    email: string;
    fullname: string;
    password: string;
    isAdmin: boolean;
    isEmailVerified: boolean;

    emailVerificationToken?: string | null;
    emailVerificationExpiry?: Date | null;
    forgotPasswordToken?: string | null;
    forgotPasswordExpiry?: Date | null;
    refreshToken?: string | null;
}
