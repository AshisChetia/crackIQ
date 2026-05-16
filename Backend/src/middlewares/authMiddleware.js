import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import UserModel from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        console.warn(`Auth Failed: No token provided for ${req.originalUrl}`);
        res.status(401);
        throw new Error("Not authorized, token missing");
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is not defined in environment variables!");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            console.warn(`Auth Failed: User with ID ${decoded.id} not found in database`);
            res.status(401);
            throw new Error("User not found");
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error(`Auth Failed: ${error.message} for route ${req.originalUrl}`);
        
        if (error.message.includes('ECONNRESET')) {
            res.status(503);
            return next(new Error("Database connection reset. Please try again."));
        }

        res.status(401);
        next(new Error("Invalid or expired token"));
    }
});