import express from "express";

import {
    getDashboardAnalytics,
    getSubjectPerformance,
    getWeeklyPerformance,
    getStrengthAnalysis,
    getAccuracyAnalytics,
    getUserActivityAnalytics,
    getResumeAnalytics,
    getOverallStats,
} from "../controllers/analyticsController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);

router.get('/subjects', protect, getSubjectPerformance);

router.get('/weekly', protect, getWeeklyPerformance);

router.get('/strength-analysis', protect, getStrengthAnalysis);

router.get('/accuracy', protect, getAccuracyAnalytics);

router.get('/activity', protect, getUserActivityAnalytics);

router.get('/resumes', protect, getResumeAnalytics);

router.get('/stats', protect, getOverallStats);

export default router;
