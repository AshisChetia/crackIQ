    import asyncHandler from "express-async-handler";

import ResumeModel from "../models/resumeModel.js";
import { analyzeResume, compareResumeToJob } from "../config/ai.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";


/*
|--------------------------------------------------------------------------
| EXTRACT RESUME TEXT
|--------------------------------------------------------------------------
|
| Extracts text from PDF file buffers using pdfjs-dist legacy build.
|
*/
const extractResumeText = async (fileBuffer) => {
    try {
        if (!fileBuffer || fileBuffer.length === 0) {
            console.error("[PDF Debug]: Empty file buffer provided");
            return null;
        }

        console.log(`[PDF Debug]: Buffer size: ${fileBuffer.length} bytes`);

        // 1. Convert Node.js Buffer to a standard Web Uint8Array
        const uint8Array = new Uint8Array(fileBuffer);

        // 2. Safely extract the getDocument function handling ESM/CJS differences
        const getDocument = pdfjsLib.getDocument || (pdfjsLib.default && pdfjsLib.default.getDocument);

        if (!getDocument) {
            throw new Error("Could not find getDocument function in pdfjsLib. Check import syntax.");
        }

        // 3. Load PDF from the converted array using the extracted function
        const loadingTask = getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        console.log(`[PDF Debug]: PDF loaded - ${pdf.numPages} pages`);

        let fullText = "";

        // 4. Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            try {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(" ");
                fullText += pageText + "\n";
            } catch (pageError) {
                console.warn(`[PDF Debug]: Error extracting page ${pageNum}:`, pageError.message);
            }
        }

        console.log(`[PDF Debug]: Total text extracted: ${fullText.length} characters`);
        console.log(`[PDF Debug]: Text preview: "${fullText.substring(0, 150).replace(/\n/g, ' ')}..."`);

        const trimmedText = fullText.trim();
        if (trimmedText.length > 0) {
            return trimmedText;
        }

        console.warn(`[PDF Debug]: No text content found in PDF (may be a scanned image)`);
        return null;
    } catch (error) {
        console.error("[PDF Debug]: Text extraction error:", error.message);
        console.error("[PDF Debug]: Stack:", error.stack);
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

    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
        res.status(400);
        throw new Error("Resume file data is missing or empty.");
    }

    console.log(`[Resume Lab]: Starting processing for user ${userId}. File: ${req.file.originalname}`);
    const startTime = Date.now();

    // 1. Extract Text
    const textStartTime = Date.now();
    const resumeText = await extractResumeText(req.file.buffer);
    
    if (!resumeText || resumeText.trim().length === 0) {
        res.status(400);
        throw new Error("Unable to process the uploaded PDF file. Please ensure it is a valid, text-based PDF.");
    }

    // 2. Run AI Analysis
    console.log("[Resume Lab]: Starting AI Analysis...");
    const aiStartTime = Date.now();

    try {
        const analysis = await analyzeResume({
            resumeText,
            targetRole: req.body.target_role || "General",
        });

        console.log(`[Resume Lab]: 🟢 AI Analysis took ${Date.now() - aiStartTime}ms`);

        if (!analysis) {
            throw new Error("AI analysis failed to return a result");
        }

        // 3. Save to Database (Removed resume_url)
        const dbStartTime = Date.now();
        const targetRole = req.body.target_role || "General";
        const savedResume = await ResumeModel.createOne({
            user_id: userId,
            target_role: targetRole,
            ats_score: analysis.score || analysis.atsScore || 0,
            strengths: JSON.stringify(analysis.strengths || []),
            weaknesses: JSON.stringify(analysis.weaknesses || []),
            missing_skills: JSON.stringify(analysis.keywords?.missing || analysis.missingSkills || []),
            suggestions: JSON.stringify(analysis.improvements || analysis.suggestions || []),
        });

        console.log(`[Resume Lab]: Total processing time: ${Date.now() - startTime}ms`);

        return sendSuccess(res, 201, "Resume analyzed successfully", {
            resume: {
                id: savedResume.id,
                target_role: analysis.target_role,
                ats_score: savedResume.ats_score,
                summary: analysis.summary,
                strengths: analysis.strengths,
                improvements: analysis.improvements || analysis.suggestions,
                keywords: analysis.keywords || { found: [], missing: analysis.missingSkills || [] },
                roleAlignment: analysis.roleAlignment,
                formattingFeedback: analysis.formattingFeedback
            },
        });
    } catch (error) {
        console.error("[Resume Lab]: Processing error:", error.message);
        res.status(500);
        throw new Error("Resume analysis failed. Please try again later.");
    }
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
            strengths: typeof resume.strengths === 'string' ? JSON.parse(resume.strengths) : resume.strengths,
            weaknesses: typeof resume.weaknesses === 'string' ? JSON.parse(resume.weaknesses) : resume.weaknesses,
            missing_skills: typeof resume.missing_skills === 'string' ? JSON.parse(resume.missing_skills) : resume.missing_skills,
            suggestions: typeof resume.suggestions === 'string' ? JSON.parse(resume.suggestions) : resume.suggestions,
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
        targetRole: target_role,
    });

    return sendSuccess(res, 200, "Resume compared successfully", {
        comparison,
    });
});