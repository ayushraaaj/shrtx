import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_URL } from "./config/env";

const app = express();

app.use(
    cors({
        // origin: "http://localhost:3000",
        origin: CLIENT_URL,
        credentials: true,
    }),
);

app.use("/api/v1/webhooks", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

import { errorHandler } from "./middlewares/error.middleware";
import healthCheckRouter from "./routers/healthcheck.route";
import authRouter from "./routers/auth.router";
import urlRouter from "./routers/url.router";
import redirectRouter from "./routers/redirect.router";

import groupRouter from "./routers/group.router";
import documentRouter from "./routers/document.router";

import paymentRouter from "./routers/payment.router";
import subscriptionRouter from "./routers/subscription.router";
import webhookRouter from "./routers/webhook.router";

app.use("/api/v1/webhooks", webhookRouter);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/url", urlRouter);
app.use("/", redirectRouter);

app.use("/api/v1/group", groupRouter);
app.use("/api/v1/document", documentRouter);

app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/subscription", subscriptionRouter);

app.use(errorHandler);

export default app;
