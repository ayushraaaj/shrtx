import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { uploadDocument } from "../controllers/document.controller";
import { uploadExcel } from "../middlewares/upload.middleware";
import { requirePro } from "../middlewares/pro.middleware";

const router = Router();

router.use(verifyJWT, requirePro);

router.route("/upload").post(uploadExcel.single("file"), uploadDocument);

export default router;
