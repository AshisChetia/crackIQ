import asyncHandler from "express-async-handler";

import ExamAttemptModel from "../models/examAttemptModel.js";
import ExamModel from "../models/examModel.js";
import ResumeModel from "../models/resumeModel.js";

/*
|--------------------------------------------------------------------------
| GET USER DASHBOARD ANALYTICS
|--------------------------------------------------------------------------
*/
export const getDashboardAnalytics = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    //Fetch User Statistics
    const totalExamAttempts =
        await ExamAttemptModel.countUserAttempts(
            userId
        );

    const averageScore =
        await ExamAttemptModel.getAverageScore(
            userId
        );

    const highestScore =
        await ExamAttemptModel.getHighestScore(
            userId
        );

    const recentAttempts =
        await ExamAttemptModel.getRecentAttempts(
            userId
        );

    const totalCreatedExams =
        await ExamModel.countUserCreatedExams(
            userId
        );

    const totalResumeAnalyses =
        await ResumeModel.countUserResumes(
            userId
        );

    return res.status(200).json({

        success: true,

        analytics: {

            exams: {

                total_exam_attempts:
                    totalExamAttempts,

                total_created_exams:
                    totalCreatedExams,

                average_score:
                    averageScore,

                highest_score:
                    highestScore,

                recent_attempts:
                    recentAttempts,
            },

            resumes: {

                total_resume_analyses:
                    totalResumeAnalyses,
            },
        },
    });
});


/*
|--------------------------------------------------------------------------
| GET SUBJECT PERFORMANCE ANALYTICS
|--------------------------------------------------------------------------
*/
export const getSubjectPerformance = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const subjectPerformance =
        await ExamAttemptModel.getSubjectPerformance(
            userId
        );

    return res.status(200).json({

        success: true,

        subject_performance:
            subjectPerformance,
    });
});


/*
|--------------------------------------------------------------------------
| GET WEEKLY PERFORMANCE
|--------------------------------------------------------------------------
*/
export const getWeeklyPerformance = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const weeklyPerformance =
        await ExamAttemptModel.getWeeklyPerformance(
            userId
        );

    return res.status(200).json({

        success: true,

        weekly_performance:
            weeklyPerformance,
    });
});


/*
|--------------------------------------------------------------------------
| GET STRONGEST AND WEAKEST SUBJECTS
|--------------------------------------------------------------------------
*/
export const getStrengthAnalysis = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const strongestSubject =
        await ExamAttemptModel.getStrongestSubject(
            userId
        );

    const weakestSubject =
        await ExamAttemptModel.getWeakestSubject(
            userId
        );

    return res.status(200).json({

        success: true,

        analysis: {

            strongest_subject:
                strongestSubject,

            weakest_subject:
                weakestSubject,
        },
    });
});


/*
|--------------------------------------------------------------------------
| GET EXAM ACCURACY ANALYTICS
|--------------------------------------------------------------------------
*/
export const getAccuracyAnalytics = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const accuracyData =
        await ExamAttemptModel.getAccuracyAnalytics(
            userId
        );

    return res.status(200).json({

        success: true,

        accuracy:
            accuracyData,
    });
});


/*
|--------------------------------------------------------------------------
| GET USER ACTIVITY ANALYTICS
|--------------------------------------------------------------------------
*/
export const getUserActivityAnalytics = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const activity =
        await ExamAttemptModel.getUserActivity(
            userId
        );

    return res.status(200).json({

        success: true,

        activity,
    });
});


/*
|--------------------------------------------------------------------------
| GET RESUME ANALYTICS
|--------------------------------------------------------------------------
*/
export const getResumeAnalytics = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const resumes =
        await ResumeModel.findByUserId(userId);


    //Calculate ATS Average
    let totalScore = 0;

    for (const resume of resumes) {

        totalScore += resume.ats_score;
    }

    const averageATSScore =
        resumes.length > 0
            ? totalScore / resumes.length
            : 0;

    //Highest ATS Score
    const highestATSScore =
        resumes.length > 0
            ? Math.max(
                ...resumes.map(
                    (resume) => resume.ats_score
                )
            )
            : 0;

    return res.status(200).json({

        success: true,

        resume_analytics: {

            total_resumes:
                resumes.length,

            average_ats_score:
                averageATSScore,

            highest_ats_score:
                highestATSScore,
        },
    });
});


/*
|--------------------------------------------------------------------------
| GET OVERALL USER STATS
|--------------------------------------------------------------------------
*/
export const getOverallStats = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    //Fetch All Required Data
    const totalExams =
        await ExamAttemptModel.countUserAttempts(
            userId
        );

    const totalResumes =
        await ResumeModel.countUserResumes(
            userId
        );

    const averageScore =
        await ExamAttemptModel.getAverageScore(
            userId
        );

    const averageATS =
        await ResumeModel.getAverageATSScore(
            userId
        );

    return res.status(200).json({

        success: true,

        stats: {

            total_exams:
                totalExams,

            total_resume_analyses:
                totalResumes,

            average_exam_score:
                averageScore,

            average_ats_score:
                averageATS,
        },
    });
});