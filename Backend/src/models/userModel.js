import db from "../config/db.js";

class UserModel {

    /*
    |--------------------------------------------------------------------------
    | CREATE USER
    |--------------------------------------------------------------------------
    */

    static async createOne(userData) {

        const {
            username,
            email,
            password,
        } = userData;

        const [result] = await db.execute(

            `
            INSERT INTO users
            (
                username,
                email,
                password
            )
            VALUES (?, ?, ?)
            `,
            [
                username,
                email,
                password,
            ]
        );

        return {
            id: result.insertId,
            username,
            email,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | FIND USER BY EMAIL
    |--------------------------------------------------------------------------
    */

    static async findByEmail(email) {

        const [rows] = await db.execute(

            `
            SELECT * FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        return rows[0];
    }

    /*
    |--------------------------------------------------------------------------
    | FIND USER BY ID
    |--------------------------------------------------------------------------
    */

    static async findById(id) {

        const [rows] = await db.execute(

            `
            SELECT *
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0];
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE USER
    |--------------------------------------------------------------------------
    */

    static async updateOne(id, data) {

        const {
            username,
            email,
        } = data;

        await db.execute(

            `
            UPDATE users
            SET
                username = ?,
                email = ?
            WHERE id = ?
            `,
            [
                username,
                email,
                id,
            ]
        );

        return await this.findById(id);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PASSWORD
    |--------------------------------------------------------------------------
    */

    static async updatePassword(id, password) {

        await db.execute(

            `
            UPDATE users
            SET password = ?
            WHERE id = ?
            `,
            [
                password,
                id,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE USER
    |--------------------------------------------------------------------------
    */

    static async deleteOne(id) {

        await db.execute(

            `
            DELETE FROM users
            WHERE id = ?
            `,
            [id]
        );
    }
}

export default UserModel;