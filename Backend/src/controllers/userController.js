import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import UserModel from "../models/userModel.js";
import ResumeModel from "../models/resumeModel.js";
import ExamAttemptModel from "../models/examAttemptModel.js";

/*
|--------------------------------------------------------------------------
| GET CURRENT USER PROFILE
|--------------------------------------------------------------------------
*/
export const getCurrentUser = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const user = await UserModel.findById(userId);

    if (!user) {

        res.status(404);

        throw new Error("User not found");
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Password
    |--------------------------------------------------------------------------
    */

    const { password, ...safeUser } = user;

    return res.status(200).json({

        success: true,

        user: safeUser,
    });
});


/*
|--------------------------------------------------------------------------
| UPDATE USER PROFILE
|--------------------------------------------------------------------------
*/
export const updateProfile = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const {
        username,
        email,
    } = req.body;

    if (!username || !email) {

        res.status(400);

        throw new Error(
            "Username and email are required"
        );
    }

    const existingUser =
        await UserModel.findByEmail(email);

    if (
        existingUser &&
        existingUser.id !== userId
    ) {

        res.status(409);

        throw new Error(
            "Email already in use"
        );
    }

    const updatedUser =
        await UserModel.updateOne(userId, {

            username,

            email,
        });

    /*
    |--------------------------------------------------------------------------
    | Remove Password
    |--------------------------------------------------------------------------
    */

    const { password, ...safeUser } = updatedUser;

    return res.status(200).json({

        success: true,

        message:
            "Profile updated successfully",

        user: safeUser,
    });
});


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/
export const changePassword = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const {
        currentPassword,
        newPassword,
    } = req.body;

    if (
        !currentPassword ||
        !newPassword
    ) {

        res.status(400);

        throw new Error(
            "All password fields are required"
        );
    }

    const user =
        await UserModel.findById(userId);

    if (!user) {

        res.status(404);

        throw new Error("User not found");
    }

    const passwordMatch =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!passwordMatch) {

        res.status(401);

        throw new Error(
            "Current password is incorrect"
        );
    }

    const hashedPassword =
        await bcrypt.hash(newPassword, 10);

    await UserModel.updatePassword(
        userId,
        hashedPassword
    );

    return res.status(200).json({

        success: true,

        message:
            "Password changed successfully",
    });
});


/*
|--------------------------------------------------------------------------
| DELETE USER ACCOUNT
|--------------------------------------------------------------------------
*/
export const deleteAccount = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    await UserModel.deleteOne(userId);

    return res.status(200).json({

        success: true,

        message:
            "Account deleted successfully",
    });
});


/*
|--------------------------------------------------------------------------
| GET USER DASHBOARD SUMMARY
|--------------------------------------------------------------------------
*/
export const getUserDashboardSummary = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const totalExamAttempts =
        await ExamAttemptModel.countUserAttempts(
            userId
        );

    const averageScore =
        await ExamAttemptModel.getAverageScore(
            userId
        );

    const totalResumeAnalyses =
        await ResumeModel.countUserResumes(
            userId
        );


    const user =
        await UserModel.findById(userId);

    return res.status(200).json({

        success: true,

        dashboard: {

            user: {

                id: user.id,

                username:
                    user.username,

                email:
                    user.email,
            },

            exams: {

                total_attempts:
                    totalExamAttempts,

                average_score:
                    averageScore,
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
| GET USER PUBLIC PROFILE
|--------------------------------------------------------------------------
*/
export const getUserPublicProfile = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!userId) {

        res.status(400);

        throw new Error(
            "User ID is required"
        );
    }

    const user =
        await UserModel.findById(userId);

    if (!user) {

        res.status(404);

        throw new Error("User not found");
    }

    const publicProfile = {

        id: user.id,

        username: user.username,

        created_at: user.created_at,
    };

    return res.status(200).json({

        success: true,

        user: publicProfile,
    });
});