import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createOrder, verifyPayment } from "../controllers/payment.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create-order").post(createOrder);
router.route("/verify").post(verifyPayment);

export default router;
