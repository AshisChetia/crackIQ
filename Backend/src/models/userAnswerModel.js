import db from "../config/db.js";

class UserAnswerModel {

    /*
    |--------------------------------------------------------------------------
    | CREATE MULTIPLE ANSWERS
    |--------------------------------------------------------------------------
    */

    static async createMany(answers) {

        for (const answer of answers) {

            await db.execute(

                `
                INSERT INTO user_answers
                (
                    attempt_id,
                    question_id,
                    selected_answer,
                    is_correct
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    answer.attempt_id,
                    answer.question_id,
                    answer.selected_answer,
                    answer.is_correct,
                ]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | FIND ANSWERS BY ATTEMPT ID
    |--------------------------------------------------------------------------
    */

    static async findByAttemptId(attemptId) {

        const [rows] = await db.execute(

            `
            SELECT *
            FROM user_answers
            WHERE attempt_id = ?
            `,
            [attemptId]
        );

        return rows;
    }
}

export default UserAnswerModel;