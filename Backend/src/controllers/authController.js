import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwt.js";
import { sendSuccess } from "../utils/apiResponse.js";
import UserModel from "../models/userModel.js"



/*
|--------------------------------------------------------------------------
| SIGNUP CONTROLLER
|--------------------------------------------------------------------------
*/
export const signup = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const existingUser = await UserModel.findByEmail(email)

    if(existingUser) {
        res.status(409);
        throw new Error("User already exists with this email")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.createOne({
        username,
        email,
        password: hashedPassword
    });

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role || "Student"
    });

    return sendSuccess(res, 201, "User registered successfully", {
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

    const user = await UserModel.findByEmail(email);

    if(!user) {
        res.status(401);
        throw new Error("Invalid email or password")
    }

    const passwordValid = await bcrypt.compare(password, user.password);
  
    if(!passwordValid) {
        res.status(401);
        throw new Error("Invalid email or password")
    }

    const token = generateToken({
        id: user.id,
    }) 

    return sendSuccess(res, 200, "User logged in successfully", {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        token
    });
});