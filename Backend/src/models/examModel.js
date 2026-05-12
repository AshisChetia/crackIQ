import db from "../config/db.js";

class ExamModel {

    /*
    |--------------------------------------------------------------------------
    | CREATE EXAM
    |--------------------------------------------------------------------------
    */

    static async createOne(data) {

        const {
            user_id,
            exam_name,
            subject,
            difficulty,
            total_questions,
            duration_minutes,
        } = data;

        const [result] = await db.execute(

            `
            INSERT INTO exams
            (
                user_id,
                exam_name,
                subject,
                difficulty,
                total_questions,
                duration_minutes
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                user_id,
                exam_name,
                subject,
                difficulty,
                total_questions,
                duration_minutes,
            ]
        );

        return {
            id: result.insertId,
            ...data,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | FIND EXAM BY ID
    |--------------------------------------------------------------------------
    */

    static async findById(id) {

        const [rows] = await db.execute(

            `
            SELECT *
            FROM exams
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0];
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE EXAM
    |--------------------------------------------------------------------------
    */

    static async deleteOne(id) {

        await db.execute(

            `
            DELETE FROM exams
            WHERE id = ?
            `,
            [id]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | COUNT USER CREATED EXAMS
    |--------------------------------------------------------------------------
    */

    static async countUserCreatedExams(userId) {

        const [rows] = await db.execute(

            `
            SELECT COUNT(*) AS total
            FROM exams
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0].total;
    }
}

export default ExamModel;