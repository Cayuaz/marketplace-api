import { Router } from "express";
import { authRegisterController } from "../controllers/authController.js";

const router = Router();

router.post("/register", authRegisterController);

export default router;
