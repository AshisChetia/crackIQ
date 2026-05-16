export const notFound = (req, res, next) => {

    const error = new Error(
        `Route Not Found - ${req.originalUrl}`
    );

    res.status(404);

    next(error);
};

export const errorHandler = (
    err,
    req,
    res,
    next
) => {

    let statusCode =
        res.statusCode === 200
            ? 500
            : res.statusCode;

    let message = err.message;

    // Always log the actual error for developers
    console.error("Error Details:", {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        statusCode: statusCode,
    });

    // Hide detailed error messages - show generic ones
    // unless explicitly in development mode with DEBUG enabled
    if (process.env.NODE_ENV !== "development" || !process.env.DEBUG) {
        if (statusCode === 500) {
            message = "A technical error occurred. Please try again later.";
        } else if (statusCode === 400) {
            message = "Invalid request. Please check your input and try again.";
        } else if (statusCode === 401) {
            message = "Unauthorized. Please log in and try again.";
        } else if (statusCode === 403) {
            message = "You don't have permission to perform this action.";
        } else if (statusCode === 404) {
            message = "The requested resource was not found.";
        }
    }

    res.status(statusCode).json({

        success: false,

        message: message,

        stack:
            process.env.NODE_ENV === "production"
                ? null
                : err.stack,
    });
};