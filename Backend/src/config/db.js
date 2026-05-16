import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true
    }
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info("Database connected successfully");
        connection.release();
    } catch (error) {
        logger.error("Error connecting to database", error.message);
    }
};

export default pool;
