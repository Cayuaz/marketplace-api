import { Router } from "express";
import {
  authLoginController,
  authRegisterController,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", authRegisterController);
router.post("/login", authLoginController);

export default router;
