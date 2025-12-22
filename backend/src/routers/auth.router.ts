import { Router } from "express";
import {
    loginUser,
    signupUser,
    verifyUserEmail,
} from "../controllers/auth.controller";
import { loginValidator, signupValidator } from "../validators/auth.validators";
import { validate } from "../middlewares/validator.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/signup").post(signupValidator(), validate, signupUser);
router.route("/login").post(loginValidator(), validate, loginUser);
router.route("/verifyemail").post(verifyUserEmail);

// router.use(verifyJWT);

export default router;
