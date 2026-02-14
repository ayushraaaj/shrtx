import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    cancelSubscription,
    createSubscription,
    proSubscription,
    // resumeSubscription,
} from "../controllers/subscription.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(createSubscription);
router.route("/me").get(proSubscription);
router.route("/cancel").post(cancelSubscription);
// router.route("/resume").post(resumeSubscription);

export default router;
