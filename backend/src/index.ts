import dotenv from "dotenv";
import connectDB from "./db/database";
import app from "./app";
import { PORT } from "./config/env";

dotenv.config({ path: "./.env" });

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
