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



/*
|--------------------------------------------------------------------------
| LOGIN CONTROLLER
|--------------------------------------------------------------------------
*/
export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are required")
    }

    const existingUser = await UserModel.findByEmail(email);

    if(!existingUser) {
        res.status(401);
        throw new Error("Invalid email or password")
    }

    const passwordValid = await bcrypt.compare(password, existingUser.password);
  
    if(!passwordValid) {
        res.status(401);
        throw new Error("Invalid email or password")
    }

    const token = generateToken({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role || "student",
    }) 

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
        },
        token
    })

})