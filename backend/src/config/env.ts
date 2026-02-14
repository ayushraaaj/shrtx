import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config();

type StringValue = NonNullable<SignOptions["expiresIn"]>;

const getEnv = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is missing`);
    }

    return value;
};

export const PORT = getEnv("PORT");

export const MONGO_URI = getEnv("MONGO_URI");

export const NODE_ENV = getEnv("NODE_ENV");

export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const ACCESS_TOKEN_EXPIRY = getEnv("ACCESS_TOKEN_EXPIRY") as StringValue;

export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");
export const REFRESH_TOKEN_EXPIRY = getEnv(
    "REFRESH_TOKEN_EXPIRY",
) as StringValue;

export const BREVO_SMTP_HOST = getEnv("BREVO_SMTP_HOST");
export const BREVO_SMTP_PORT = getEnv("BREVO_SMTP_PORT");
export const BREVO_SMTP_USER = getEnv("BREVO_SMTP_USER");
export const BREVO_SMTP_PASS = getEnv("BREVO_SMTP_PASS");

export const BREVO_API_KEY = getEnv("BREVO_API_KEY");

export const CLIENT_URL = getEnv("CLIENT_URL");
export const BACKEND_URL = getEnv("BACKEND_URL");

export const RAZORPAY_KEY_ID = getEnv("RAZORPAY_KEY_ID");
export const RAZORPAY_KEY_SECRET = getEnv("RAZORPAY_KEY_SECRET");
export const RAZORPAY_PLAN_ID = getEnv("RAZORPAY_PLAN_ID");

export const RAZORPAY_WEBHOOK_SECRET = getEnv("RAZORPAY_WEBHOOK_SECRET");
