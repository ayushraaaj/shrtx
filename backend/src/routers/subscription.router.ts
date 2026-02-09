import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createSubscription } from "../controllers/subscription.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create-subscription").post(createSubscription);

export default router;
