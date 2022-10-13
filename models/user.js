const bcrypt = require('bcrypt')
const { BCRYPT_WORK_FACTOR, DB_URI } = require('../config')
const ExpressError = require('../helpers/expressErrors')
const db = require('../db')


/** User of the site. */

class User {

    /** register new user -- returns
     *    {username, password}
     */

    static async register({ username, password}) {
        if (!username || !password) {
            throw new ExpressError("Require username and password", 401)
        };
        
            const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

            const result = await db.query(`INSERT INTO users (username, password, join_at, last_login_at)
                    VALUES ($1,$2, current_timestamp, current_timestamp)
                    RETURNING username, password, join_at, last_login_at`,
                [username, hashedPwd]);
            
            return result.rows[0]
        

    }

    /** Authenticate: is this username/password valid? Returns boolean. */

    static async authenticate(username, password) {
        
        const result = await db.query(`SELECT * FROM users
                                WHERE username=$1`, [username]);

        const hashedPwd = result.rows[0].password;
        const validPwd = await bcrypt.compare(password, hashedPwd);

        return validPwd
    }




    /** Update last_login_at for user */

    static async updateLoginTimestamp(username) {
        const result = await db.query(`UPDATE users
                                        SET last_login_at=current_timestamp
                                        WHERE username=$1`, [username]);

    }

    static async getUserPosts(username){
        const posts = await db.query(`SELECT id, x_coordinate, y_coordinate, opens_at, closes_at, washroom_type
                                       FROM submitted_washrooms
                                       WHERE submitted_washrooms.user_id = $1`, [username])
        if(posts.rows.length ===0){
            throw new ExpressError('no posts for user', 400)
        }
        return posts.rows
    }

    static async get(username) {
        
        const user = await db.query(`SELECT username, join_at, last_login_at
                                FROM users
                                WHERE username=$1`, [username]);

        if (user.rows.length === 0) {
            throw new ExpressError('username does not exit', 404)
        };
        return user.rows[0]
    }

    static async remove (username){

        const user = await db.query(`DELETE FROM users WHERE username = $1 return username `, [username])

        return user.rows[0]
    }

}

module.exports = User