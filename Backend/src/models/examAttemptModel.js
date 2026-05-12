import db from "../config/db.js";

class ExamAttemptModel {

    /*
    |--------------------------------------------------------------------------
    | CREATE ATTEMPT
    |--------------------------------------------------------------------------
    */

    static async createOne(data) {

        const {
            user_id,
            exam_id,
            score,
            correct_answers,
            wrong_answers,
        } = data;

        const [result] = await db.execute(

            `
            INSERT INTO exam_attempts
            (
                user_id,
                exam_id,
                score,
                correct_answers,
                wrong_answers
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                user_id,
                exam_id,
                score,
                correct_answers,
                wrong_answers,
            ]
        );

        return {
            id: result.insertId,
            ...data,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | FIND ATTEMPT BY ID
    |--------------------------------------------------------------------------
    */

    static async findById(id) {

        const [rows] = await db.execute(

            `
            SELECT ea.*, e.exam_name, e.subject, e.difficulty
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0];
    }

    /*
    |--------------------------------------------------------------------------
    | FIND ATTEMPTS BY USER ID
    |--------------------------------------------------------------------------
    */

    static async findByUserId(userId) {

        const [rows] = await db.execute(

            `
            SELECT ea.*, e.exam_name, e.subject, e.difficulty
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.user_id = ?
            ORDER BY ea.created_at DESC
            `,
            [userId]
        );

        return rows;
    }

    /*
    |--------------------------------------------------------------------------
    | COUNT USER ATTEMPTS
    |--------------------------------------------------------------------------
    */

    static async countUserAttempts(userId) {

        const [rows] = await db.execute(

            `
            SELECT COUNT(*) AS total
            FROM exam_attempts
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0].total;
    }

    /*
    |--------------------------------------------------------------------------
    | GET AVERAGE SCORE
    |--------------------------------------------------------------------------
    */

    static async getAverageScore(userId) {

        const [rows] = await db.execute(

            `
            SELECT ROUND(AVG(score), 2) AS average_score
            FROM exam_attempts
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0].average_score || 0;
    }

    /*
    |--------------------------------------------------------------------------
    | GET HIGHEST SCORE
    |--------------------------------------------------------------------------
    */

    static async getHighestScore(userId) {

        const [rows] = await db.execute(

            `
            SELECT MAX(score) AS highest_score
            FROM exam_attempts
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0].highest_score || 0;
    }

    /*
    |--------------------------------------------------------------------------
    | GET RECENT ATTEMPTS (Last 5)
    |--------------------------------------------------------------------------
    */

    static async getRecentAttempts(userId) {

        const [rows] = await db.execute(

            `
            SELECT ea.*, e.exam_name, e.subject, e.difficulty
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.user_id = ?
            ORDER BY ea.created_at DESC
            LIMIT 5
            `,
            [userId]
        );

        return rows;
    }

    /*
    |--------------------------------------------------------------------------
    | GET SUBJECT PERFORMANCE
    |--------------------------------------------------------------------------
    |
    | Groups attempts by subject and returns:
    | - total attempts per subject
    | - average score per subject
    |
    */

    static async getSubjectPerformance(userId) {

        const [rows] = await db.execute(

            `
            SELECT
                e.subject,
                COUNT(*) AS total_attempts,
                ROUND(AVG(ea.score), 2) AS average_score,
                MAX(ea.score) AS highest_score
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.user_id = ?
            GROUP BY e.subject
            ORDER BY average_score DESC
            `,
            [userId]
        );

        return rows;
    }

    /*
    |--------------------------------------------------------------------------
    | GET WEEKLY PERFORMANCE (Last 7 Days)
    |--------------------------------------------------------------------------
    */

    static async getWeeklyPerformance(userId) {

        const [rows] = await db.execute(

            `
            SELECT
                DATE(ea.created_at) AS date,
                COUNT(*) AS attempts,
                ROUND(AVG(ea.score), 2) AS average_score
            FROM exam_attempts ea
            WHERE ea.user_id = ?
            AND ea.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(ea.created_at)
            ORDER BY date ASC
            `,
            [userId]
        );

        return rows;
    }

    /*
    |--------------------------------------------------------------------------
    | GET STRONGEST SUBJECT
    |--------------------------------------------------------------------------
    */

    static async getStrongestSubject(userId) {

        const [rows] = await db.execute(

            `
            SELECT
                e.subject,
                ROUND(AVG(ea.score), 2) AS average_score
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.user_id = ?
            GROUP BY e.subject
            ORDER BY average_score DESC
            LIMIT 1
            `,
            [userId]
        );

        return rows[0] || null;
    }

    /*
    |--------------------------------------------------------------------------
    | GET WEAKEST SUBJECT
    |--------------------------------------------------------------------------
    */

    static async getWeakestSubject(userId) {

        const [rows] = await db.execute(

            `
            SELECT
                e.subject,
                ROUND(AVG(ea.score), 2) AS average_score
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.user_id = ?
            GROUP BY e.subject
            ORDER BY average_score ASC
            LIMIT 1
            `,
            [userId]
        );

        return rows[0] || null;
    }

    /*
    |--------------------------------------------------------------------------
    | GET ACCURACY ANALYTICS
    |--------------------------------------------------------------------------
    */

    static async getAccuracyAnalytics(userId) {

        const [rows] = await db.execute(

            `
            SELECT
                SUM(correct_answers) AS total_correct,
                SUM(wrong_answers) AS total_wrong,
                SUM(correct_answers) + SUM(wrong_answers) AS total_answered,
                ROUND(
                    (SUM(correct_answers) / (SUM(correct_answers) + SUM(wrong_answers))) * 100,
                    2
                ) AS accuracy_percentage
            FROM exam_attempts
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0];
    }

    /*
    |--------------------------------------------------------------------------
    | GET USER ACTIVITY (Attempts Per Day - Last 30 Days)
    |--------------------------------------------------------------------------
    */

    static async getUserActivity(userId) {

        const [rows] = await db.execute(

            `
            SELECT
                DATE(created_at) AS date,
                COUNT(*) AS attempts
            FROM exam_attempts
            WHERE user_id = ?
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            `,
            [userId]
        );

        return rows;
    }
}

export default ExamAttemptModel;