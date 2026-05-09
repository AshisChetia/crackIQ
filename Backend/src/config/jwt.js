import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


/*
|--------------------------------------------------------------------------
| Generate JWT Token
|--------------------------------------------------------------------------
*/
export const generateToken = (payload) => {
    try {
        return jwt.sign(payload,
        process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
    } catch (error) {
        throw new Error("Failed to generate token")
    }
}


/*
|--------------------------------------------------------------------------
| Verify JWT Token
|--------------------------------------------------------------------------
*/
export const verifyToken = (token) => {
    try {
        return jwt.verify(
            token, 
            process.env.JWT_SECRET)
    } catch (error) {
        throw new Error("Invalid or Expired token")
    }
}