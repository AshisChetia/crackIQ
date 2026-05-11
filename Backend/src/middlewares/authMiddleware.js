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

        res.status(401);

        throw new Error("Not authorized, token missing");
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user =
            await UserModel.findById(decoded.id);

        if (!user) {

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

        res.status(401);

        throw new Error("Invalid or expired token");
    }
});