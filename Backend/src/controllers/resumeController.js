import asyncHandler from "express-async-handler";

import ResumeModel from "../models/resumeModel.js";
import { analyzeResume, compareResumeToJob } from "../config/ai.js";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware.js";
import { sendSuccess } from "../utils/apiResponse.js";
import pdfParse from "pdf-parse";


/*
|--------------------------------------------------------------------------
| EXTRACT RESUME TEXT
|--------------------------------------------------------------------------
|
| Extracts text from PDF file buffers.
|
*/
const extractResumeText = async (fileBuffer) => {
    try {
        const pdfData = await pdfParse(fileBuffer);

        if (pdfData.text) {
            return pdfData.text;
        }

        return null;
    } catch (error) {
        console.error("Resume text extraction error:", error.message);
        return null;
    }
};


/*
|--------------------------------------------------------------------------
| UPLOAD & ANALYZE RESUME
|--------------------------------------------------------------------------
*/
export const uploadResume = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    if (!req.file) {
        res.status(400);
        throw new Error("Resume file is required");
    }

    // Upload Resume To Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
    );

    if (!cloudinaryResult) {
        res.status(500);
        throw new Error("Failed to upload resume");
    }

    const resumeUrl = cloudinaryResult.secure_url;

    // Extract Resume Text
    const resumeText = await extractResumeText(req.file.buffer);

    if (!resumeText) {
        res.status(500);
        throw new Error("Failed to extract resume text");
    }

    // Analyze Resume Using AI
    const analysis = await analyzeResume({
        resumeText,
        targetRole: req.body.target_role || "General",
    });

    if (!analysis) {
        res.status(500);
        throw new Error("Failed to analyze resume");
    }

    // Save Resume Analysis
    const savedResume = await ResumeModel.createOne({
        user_id: userId,
        resume_url: resumeUrl,
        ats_score: analysis.atsScore,
        strengths: JSON.stringify(analysis.strengths),
        weaknesses: JSON.stringify(analysis.weaknesses),
        missing_skills: JSON.stringify(analysis.missingSkills),
        suggestions: JSON.stringify(analysis.suggestions),
    });

    return sendSuccess(res, 201, "Resume analyzed successfully", {
        resume: {
            id: savedResume.id,
            resume_url: savedResume.resume_url,
            ats_score: savedResume.ats_score,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            missing_skills: analysis.missingSkills,
            suggestions: analysis.suggestions,
        },
    });
});


/*
|--------------------------------------------------------------------------
| GET RESUME HISTORY
|--------------------------------------------------------------------------
*/
export const getResumeHistory = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const resumes = await ResumeModel.findByUserId(userId);

    return sendSuccess(res, 200, "Resume history fetched", {
        total_resumes: resumes.length,
        resumes,
    });
});


/*
|--------------------------------------------------------------------------
| GET RESUME ANALYSIS BY ID
|--------------------------------------------------------------------------
*/
export const getResumeAnalysisById = asyncHandler(async (req, res) => {

    const { resumeId } = req.params;

    if (!resumeId) {
        res.status(400);
        throw new Error("Resume ID is required");
    }

    const resume = await ResumeModel.findById(resumeId);

    if (!resume) {
        res.status(404);
        throw new Error("Resume analysis not found");
    }

    return sendSuccess(res, 200, "Resume analysis fetched", {
        resume: {
            ...resume,
            strengths: JSON.parse(resume.strengths),
            weaknesses: JSON.parse(resume.weaknesses),
            missing_skills: JSON.parse(resume.missing_skills),
            suggestions: JSON.parse(resume.suggestions),
        },
    });
});


/*
|--------------------------------------------------------------------------
| DELETE RESUME ANALYSIS
|--------------------------------------------------------------------------
*/
export const deleteResumeAnalysis = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { resumeId } = req.params;

    if (!resumeId) {
        res.status(400);
        throw new Error("Resume ID is required");
    }

    const resume = await ResumeModel.findById(resumeId);

    if (!resume) {
        res.status(404);
        throw new Error("Resume analysis not found");
    }

    //Authorization check
    if (resume.user_id !== userId) {
        res.status(403);
        throw new Error("Unauthorized access");
    }

    await ResumeModel.deleteOne(resumeId);

    return sendSuccess(res, 200, "Resume analysis deleted successfully");
});


/*
|--------------------------------------------------------------------------
| COMPARE RESUME WITH JOB ROLE
|--------------------------------------------------------------------------
*/
export const compareResumeWithJob = asyncHandler(async (req, res) => {

    const { resumeId } = req.params;

    const { target_role } = req.body;

    if (!resumeId || !target_role) {
        res.status(400);
        throw new Error("Resume ID and target role are required");
    }

    const resume = await ResumeModel.findById(resumeId);

    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    // Compare resume with job role using AI
    const comparison = await compareResumeToJob({
        resumeText: resume.resume_url,
        targetRole: target_role,
    });

    return sendSuccess(res, 200, "Resume compared successfully", {
        comparison,
    });
});