import { Router } from "express";
import { openShortUrl } from "../controllers/url.controller";

const router = Router();

router.route("/:shortCode").get(openShortUrl);

export default router;
