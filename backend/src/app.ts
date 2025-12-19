import express from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());

import { errorHandler } from "./middlewares/error.middleware";
import healthCheckRouter from "./routers/healthcheck.route";
import authRouter from "./routers/auth.router";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

export default app;
