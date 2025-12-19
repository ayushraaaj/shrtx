import dotenv from "dotenv";
import connectDB from "./db/database";
import app from "./app";

dotenv.config({ path: "./.env" });

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
