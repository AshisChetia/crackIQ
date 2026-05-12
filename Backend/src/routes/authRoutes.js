import express from "express";
import { login, signup } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middlewares/validationMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post('/register', authLimiter, validateRegister, signup);

router.post('/login', authLimiter, validateLogin, login);

export default router;