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

    // If it's a 500 error (Internal Server Error), hide the specific technical details from the user
    if (statusCode === 500) {
        // Log the actual error for the developer
        console.error("Critical Server Error:", {
            message: err.message,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
        });

        // Show a generic message to the user
        message = "A technical error occurred on our end. The team has been notified. Please try again later.";
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