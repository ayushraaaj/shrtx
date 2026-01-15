import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { uploadDocument } from "../controllers/document.controller";
import { uploadExcel } from "../middlewares/upload.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/upload").post(uploadExcel.single("file"), uploadDocument);

export default router;
