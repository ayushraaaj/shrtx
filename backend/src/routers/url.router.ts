import { Router } from "express";
import {
    deleteUrl,
    exportAllUrlsAnalytics,
    exportUrlAnalytics,
    exportUrls,
    generateQR,
    getAllUrlAnalytics,
    getAllUrlDetails,
    getUrlAnalytics,
    shortUrl,
    toggleUrlStatus,
    verifyUrlPassword,
} from "../controllers/url.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { shortUrlValidator } from "../validators/url.validators";
import { validate } from "../middlewares/validator.middleware";

const router = Router();

router.route("/verify-password").post(verifyUrlPassword);

router.use(verifyJWT);

router.route("/").post(shortUrlValidator(), validate, shortUrl);
router.route("/generate-qr").post(generateQR);
router.route("/get-all").get(getAllUrlDetails);

router.route("/:id/togglestatus").patch(toggleUrlStatus);
router.route("/:id/delete").delete(deleteUrl);
router.route("/export").get(exportUrls);
router.route("/analytics/overview").get(getAllUrlAnalytics);
router.route("/analytics/:id").get(getUrlAnalytics);
router.route("/analytics/:id/export/pdf").post(exportUrlAnalytics);
router.route("/analytics/export/overview/pdf").post(exportAllUrlsAnalytics);

export default router;
