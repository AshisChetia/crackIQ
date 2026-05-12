/*
|--------------------------------------------------------------------------
| Standard API Response Formatter
|--------------------------------------------------------------------------
|
| Ensures all API responses follow a consistent JSON format:
|
| Success: { success: true, message: "...", data: {...} }
| Error:   { success: false, message: "..." }
|
*/


/**
 * Send a success response
 * 
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {object} data - Response data payload
 */
export const sendSuccess = (res, statusCode = 200, message, data = {}) => {

    return res.status(statusCode).json({
        success: true,
        message,
        ...data,
    });
};


/**
 * Send an error response (used when you want to send errors manually)
 * 
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 */
export const sendError = (res, statusCode = 500, message) => {

    return res.status(statusCode).json({
        success: false,
        message,
    });
};
