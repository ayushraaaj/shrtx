import { Router } from "express";
import {
    deleteUrl,
    exportUrls,
    generateQR,
    getAllUrlDetails,
    shortUrl,
    toggleUrlStatus,
} from "../controllers/url.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { shortUrlValidator } from "../validators/url.validators";
import { validate } from "../middlewares/validator.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/").post(shortUrlValidator(), validate, shortUrl);
router.route("/generate-qr").post(generateQR);
router.route("/get-all").get(getAllUrlDetails);

router.route("/:id/togglestatus").patch(toggleUrlStatus);
router.route("/:id/delete").delete(deleteUrl);
router.route("/export").get(exportUrls);

export default router;
