import express from "express";
import {
    createExam,
    getExamById,
    getExamHistory,
    getExamResult,
    submitExam,
    deleteExam,
    regenerateQuestions,
} from "../controllers/examController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateCreateExam, validateSubmitExam } from "../middlewares/validationMiddleware.js"

const router = express.Router();

// Create a new exam (AI generates questions)
router.post('/create', protect, validateCreateExam, createExam);

// Submit exam answers
router.post('/:examId/submit', protect, validateSubmitExam, submitExam);

// Regenerate questions for an exam
router.post('/:examId/regenerate', protect, regenerateQuestions);

// Get exam history for current user
router.get('/history/me', protect, getExamHistory);

// Get exam result by attempt ID
router.get('/result/:attemptId', protect, getExamResult);

// Get exam by ID
router.get('/:examId', protect, getExamById);

// Delete an exam
router.delete('/:examId', protect, deleteExam);

export default router;