import asyncHandler from "express-async-handler";

import ResumeModel from "../models/resumeModel.js";

import { extractResumeText, analyzeResume, compareResumeToJob} from "../services/resumeService.js"


/*
|--------------------------------------------------------------------------
| UPLOAD & ANALYZE RESUME
|--------------------------------------------------------------------------
*/
export const uploadResume = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    //Validate File Upload
    if(!req.file) {
        res.status(400);
        throw new Error("Resume file is required");
    }

    //Validate File Type
    const allowedMimeTypes = [
        "application/pdf",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if(!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(400);
        throw new Error("Only PDF and DOCX files are allowed")
    }

    //Extract Resume Text
    const resumeText =
        await extractResumeText(req.file.path);

    if (!resumeText) {

        res.status(500);

        throw new Error(
            "Failed to extract resume text"
        );
    }

    //Analyze Resume Using AI
    const analysis =
        await analyzeResume(resumeText);

    if (!analysis) {

        res.status(500);

        throw new Error(
            "Failed to analyze resume"
        );
    }

    //Save Resume Analysis
    const savedResume =
        await ResumeModel.createOne({

            user_id: userId,

            resume_url: req.file.path,

            ats_score: analysis.atsScore,

            strengths: JSON.stringify(
                analysis.strengths
            ),

            weaknesses: JSON.stringify(
                analysis.weaknesses
            ),

            missing_skills: JSON.stringify(
                analysis.missingSkills
            ),

            suggestions: JSON.stringify(
                analysis.suggestions
            ),
        });

    return res.status(201).json({

        success: true,

        message:
            "Resume analyzed successfully",

        resume: {

            id: savedResume.id,

            ats_score: analysis.atsScore,

            strengths: analysis.strengths,

            weaknesses: analysis.weaknesses,

            missing_skills:
                analysis.missingSkills,

            suggestions:
                analysis.suggestions,
        },
    });
})


/*
|--------------------------------------------------------------------------
| GET RESUME HISTORY
|--------------------------------------------------------------------------
*/
export const getResumeHistory =  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const resumes =
        await ResumeModel.findByUserId(userId);

    return res.status(200).json({

        success: true,

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

        throw new Error(
            "Resume ID is required"
        );
    }

    const resume =
        await ResumeModel.findById(resumeId);

    if (!resume) {

        res.status(404);

        throw new Error(
            "Resume analysis not found"
        );
    }

    return res.status(200).json({

        success: true,

        resume: {

            ...resume,

            strengths:
                JSON.parse(resume.strengths),

            weaknesses:
                JSON.parse(resume.weaknesses),

            missing_skills:
                JSON.parse(resume.missing_skills),

            suggestions:
                JSON.parse(resume.suggestions),
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

        throw new Error(
            "Resume ID is required"
        );
    }

    const resume =
        await ResumeModel.findById(resumeId);

    if (!resume) {

        res.status(404);

        throw new Error(
            "Resume analysis not found"
        );
    }

    //Authorization check
    if (resume.user_id !== userId) {

        res.status(403);

        throw new Error(
            "Unauthorized access"
        );
    }

    await ResumeModel.deleteOne(resumeId);

    return res.status(200).json({

        success: true,

        message:
            "Resume analysis deleted successfully",
    });
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

        throw new Error(
            "Resume ID and target role are required"
        );
    }

    const resume =
        await ResumeModel.findById(resumeId);

    if (!resume) {

        res.status(404);

        throw new Error(
            "Resume not found"
        );
    }

    //Extract resume text again
    const resumeText =
        await extractResumeText(
            resume.resume_url
        );

    //Compare resume with job roles
    const comparison =
        await compareResumeToJob({

            resumeText,

            targetRole: target_role,
        });

    return res.status(200).json({

        success: true,

        comparison,
    });
});