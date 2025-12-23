import { Router } from "express";
import { shortUrl } from "../controllers/url.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/").post(shortUrl);
export default router;
