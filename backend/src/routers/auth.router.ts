import { Router } from "express";
import {
    authMe,
    forgotPassword,
    loginUser,
    logoutUser,
    setForgotPassword,
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

router.route("/forgot-password").post(forgotPassword);
router.route("/forgot-password/set").post(setForgotPassword);

router.use(verifyJWT);

router.route("/logout").post(logoutUser);
router.route("/me").get(authMe);

export default router;
