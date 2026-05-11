import rateLimit from "express-rate-limit";

/*
|--------------------------------------------------------------------------
| Global API Rate Limiter
|--------------------------------------------------------------------------
*/

export const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 100,

    message: {

        success: false,

        message:
            "Too many requests, please try again later",
    },

    standardHeaders: true,

    legacyHeaders: false,
});

/*
|--------------------------------------------------------------------------
| Auth Rate Limiter
|--------------------------------------------------------------------------
*/

export const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 10,

    message: {

        success: false,

        message:
            "Too many login/signup attempts",
    },

    standardHeaders: true,

    legacyHeaders: false,
});