import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    createSubscription,
    proSubscription,
} from "../controllers/subscription.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(createSubscription);
router.route("/me").get(proSubscription);

export default router;
