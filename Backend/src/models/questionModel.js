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
}

export default QuestionModel;