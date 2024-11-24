import exp from "constants";
import { register, login, refreshAuthToken, logout } from "../controllers/auth";
import { validateLogin } from "../validations/auth";
import { router } from "./router";

router.route("/register").post(validateLogin, register);
router.route("/login").post(validateLogin, login);
router.route("/refresh").post(refreshAuthToken);
router.route("/logout").post(logout);

export default router;
