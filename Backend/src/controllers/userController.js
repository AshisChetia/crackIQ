import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import UserModel from "../models/userModel.js";
import { sendSuccess } from "../utils/apiResponse.js";

/*
|--------------------------------------------------------------------------
| GET CURRENT USER PROFILE
|--------------------------------------------------------------------------
*/
export const getProfile = asyncHandler(async (req, res) => {

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

    return sendSuccess(res, 200, "Profile fetched", {
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

    return sendSuccess(res, 200, "Profile updated successfully", {
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

    return sendSuccess(res, 200, "Password changed successfully");
});


/*
|--------------------------------------------------------------------------
| DELETE USER ACCOUNT
|--------------------------------------------------------------------------
*/
export const deleteAccount = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    await UserModel.deleteOne(userId);

    return sendSuccess(res, 200, "Account deleted successfully");
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

    return sendSuccess(res, 200, "Public profile fetched", {
        user: publicProfile,
    });
});