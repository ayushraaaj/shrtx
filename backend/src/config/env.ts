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
    "REFRESH_TOKEN_EXPIRY"
) as StringValue;

export const MAILTRAP_SMTP_HOST = getEnv("MAILTRAP_SMTP_HOST");
export const MAILTRAP_SMTP_PORT = getEnv("MAILTRAP_SMTP_PORT");
export const MAILTRAP_SMTP_USER = getEnv("MAILTRAP_SMTP_USER");
export const MAILTRAP_SMTP_PASS = getEnv("MAILTRAP_SMTP_PASS");

export const CLIENT_URL = getEnv("CLIENT_URL");
export const BACKEND_URL = getEnv("BACKEND_URL");

