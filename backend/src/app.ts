import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        // origin: "http://localhost:3000",
        origin: `${CLIENT_URL}`,
        credentials: true,
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

import { errorHandler } from "./middlewares/error.middleware";
import healthCheckRouter from "./routers/healthcheck.route";
import authRouter from "./routers/auth.router";
import urlRouter from "./routers/url.router";
import redirectRouter from "./routers/redirect.router";
import { CLIENT_URL } from "./config/env";

import groupRouter from "./routers/group.router";
import documentRouter from "./routers/document.router";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/url", urlRouter);
app.use("/", redirectRouter);

app.use("/api/v1/group", groupRouter);
app.use("/api/v1/document", documentRouter);

app.use(errorHandler);

export default app;
