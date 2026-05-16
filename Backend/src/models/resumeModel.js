import db from "../config/db.js";

class ResumeModel {

    /*
    |--------------------------------------------------------------------------
    | CREATE RESUME ANALYSIS
    |--------------------------------------------------------------------------
    */

    static async createOne(data) {
        // 1. We removed resume_url and added target_role here:
        const {
            user_id,
            target_role, 
            ats_score,
            strengths,
            weaknesses,
            missing_skills,
            suggestions,
        } = data;

        const [result] = await db.execute(
            `
            INSERT INTO resume_analyses
            (
                user_id,
                target_role,
                ats_score,
                strengths,
                weaknesses,
                missing_skills,
                suggestions
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user_id,
                target_role,
                ats_score,
                strengths,
                weaknesses,
                missing_skills,
                suggestions,
            ]
        );

        return {
            id: result.insertId,
            ...data,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | FIND RESUME BY ID
    |--------------------------------------------------------------------------
    */

    static async findById(id) {

        const [rows] = await db.execute(

            `
            SELECT *
            FROM resume_analyses
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0];
    }

    /*
    |--------------------------------------------------------------------------
    | FIND USER RESUMES
    |--------------------------------------------------------------------------
    */

    static async findByUserId(userId) {

        const [rows] = await db.execute(

            `
            SELECT *
            FROM resume_analyses
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return rows;
    }

    /*
    |--------------------------------------------------------------------------
    | COUNT USER RESUMES
    |--------------------------------------------------------------------------
    */

    static async countUserResumes(userId) {

        const [rows] = await db.execute(

            `
            SELECT COUNT(*) AS total
            FROM resume_analyses
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0].total;
    }

    /*
    |--------------------------------------------------------------------------
    | GET AVERAGE ATS SCORE
    |--------------------------------------------------------------------------
    */

    static async getAverageATSScore(userId) {

        const [rows] = await db.execute(

            `
            SELECT AVG(ats_score) AS average_ats
            FROM resume_analyses
            WHERE user_id = ?
            `,
            [userId]
        );

        return rows[0].average_ats || 0;
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE RESUME
    |--------------------------------------------------------------------------
    */

    static async deleteOne(id) {

        await db.execute(

            `
            DELETE FROM resume_analyses
            WHERE id = ?
            `,
            [id]
        );
    }
}

export default ResumeModel;