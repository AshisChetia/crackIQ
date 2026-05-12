/*
|--------------------------------------------------------------------------
| Logger Utility
|--------------------------------------------------------------------------
|
| Structured logging with timestamps and log levels.
|
| Replaces scattered console.log / console.error calls
| with a consistent, readable format.
|
| Usage:
|   import logger from "../utils/logger.js";
|
|   logger.info("Server started on port 3000");
|   logger.warn("Rate limit approaching");
|   logger.error("Database connection failed", error.message);
|   logger.debug("Query result", data);
|
*/


const COLORS = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
};


const getTimestamp = () => {

    return new Date().toISOString();
};


const formatMessage = (level, color, message, data) => {

    const timestamp = `${COLORS.gray}${getTimestamp()}${COLORS.reset}`;

    const tag = `${color}[${level}]${COLORS.reset}`;

    const logMessage = `${timestamp} ${tag} ${message}`;

    if (data !== undefined) {

        console.log(logMessage, data);
    } else {

        console.log(logMessage);
    }
};


const logger = {

    info: (message, data) => {
        formatMessage("INFO", COLORS.green, message, data);
    },

    warn: (message, data) => {
        formatMessage("WARN", COLORS.yellow, message, data);
    },

    error: (message, data) => {
        formatMessage("ERROR", COLORS.red, message, data);
    },

    debug: (message, data) => {
        if (process.env.NODE_ENV !== "production") {
            formatMessage("DEBUG", COLORS.cyan, message, data);
        }
    },
};

export default logger;
