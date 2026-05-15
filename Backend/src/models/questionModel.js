import db from "../config/db.js";

class QuestionModel {

    /*
    |--------------------------------------------------------------------------
    | CREATE MULTIPLE QUESTIONS
    |--------------------------------------------------------------------------
    */

    static async createMany(questions) {

        for (const q of questions) {

            await db.execute(

                `
                INSERT INTO questions
                (
                    exam_id,
                    question_text,
                    options,
                    correct_answer,
                    explanation
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    q.exam_id,
                    q.question_text,
                    q.options,
                    q.correct_answer,
                    q.explanation,
                ]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | FIND QUESTIONS BY EXAM ID
    |--------------------------------------------------------------------------
    */

    static async findByExamId(examId) {

        const [rows] = await db.execute(

            `
            SELECT *
            FROM questions
            WHERE exam_id = ?
            `,
            [examId]
        );

        return rows;
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE QUESTIONS BY EXAM ID
    |--------------------------------------------------------------------------
    */

    static async deleteByExamId(examId) {

        await db.execute(

            `
            DELETE FROM questions
            WHERE exam_id = ?
            `,
            [examId]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | FIND PREVIOUS QUESTIONS FOR UNIQUENESS
    |--------------------------------------------------------------------------
    */

    static async findPreviousQuestions(userId, subject, difficulty, limit = 30) {

        const [rows] = await db.execute(

            `
            SELECT q.question_text
            FROM questions q
            JOIN exams e ON q.exam_id = e.id
            WHERE e.user_id = ? AND e.subject = ? AND e.difficulty = ?
            ORDER BY q.id DESC
            LIMIT ${Number(limit)}
            `,
            [userId, subject, difficulty]
        );

        return rows.map(r => r.question_text);
    }
}

export default QuestionModel;