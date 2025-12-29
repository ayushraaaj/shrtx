import { Router } from "express";
import { generateQR, getAllUrlDetails, shortUrl } from "../controllers/url.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/").post(shortUrl);
router.route("/generate-qr").post(generateQR);
router.route('/get-all').get(getAllUrlDetails)

export default router;
