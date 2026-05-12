import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js"

import { uploadResume, getResumeHistory, getResumeAnalysisById, deleteResumeAnalysis, compareResumeWithJob } from "../controllers/resumeController.js";

const router = express.Router();

router.post('/upload', protect, upload.single("resume"), uploadResume);

router.get('/history', protect, getResumeHistory);

router.get('/:resumeId', protect, getResumeAnalysisById);

router.delete('/:resumeId', protect, deleteResumeAnalysis);

router.post('/:resumeId/compare', protect, compareResumeWithJob);

export default router;