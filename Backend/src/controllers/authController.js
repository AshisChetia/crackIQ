import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateToken, verifyToken } from "../config/jwt.js";
import dotenv from "dotenv";

dotenv.config();


/*
|--------------------------------------------------------------------------
| SIGNUP CONTROLLER
|--------------------------------------------------------------------------
*/
export const signup = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are required")
    }

    const existingUser = await UserModel.findByEmail(email)

    if(existingUser) {
        res.status(409);
        throw new Error("User already exists with this email")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
        username,
        email,
        password: hashedPassword
    });

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role || "Student"
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",

        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },

        token
    });
});

