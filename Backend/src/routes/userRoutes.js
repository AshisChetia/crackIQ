import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    getUserPublicProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Authenticated user routes
router.get('/profile', protect, getProfile);

router.put('/profile', protect, updateProfile);

router.put("/change-password", protect, changePassword);

router.delete("/delete-account", protect, deleteAccount);

// Public route (no auth needed)
router.get('/:userId', getUserPublicProfile);

export default router;