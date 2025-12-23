import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { openShortUrl } from "../controllers/url.controller";

const router = Router();

router.use(verifyJWT);

router.route("/:shortCode").get(openShortUrl);

export default router;
