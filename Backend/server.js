import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import logger from "./src/utils/logger.js";

// Route imports
import authRoutes from "./src/routes/authRoutes.js";
import examRoutes from "./src/routes/examRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Middleware imports
import { notFound, errorHandler } from "./src/middlewares/errorMiddleware.js";
import { apiLimiter } from "./src/middlewares/rateLimiter.js";

dotenv.config();

const app = express();

// Body parsing
app.use(express.json());
app.use(cors());

// Global rate limiter
app.use(apiLimiter);

// Database connection
connectDB();

const PORT = process.env.PORT || 3000;

// Health check
app.get('/', (req, res) => {
    res.send("Backend API is running")
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})