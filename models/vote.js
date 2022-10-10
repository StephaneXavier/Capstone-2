const ExpressError = require('../helpers/expressErrors')
const db = require('../db')

class Vote{

    static async getVote({washroomId, username}){
        const result = await db.query(`SELECT * FROM votes WHERE post_id = $1 AND user_id = $2`, [washroomId, username])

        return result.rows
    }

    static async upvote({washroomId, username}){
        
        const result = await db.query(`INSERT INTO votes (user_id, post_id, upvote)
                                VALUES ($1,$2,1)`, [username, washroomId])
    }

    static async downvote({washroomId, username}){
        
        const result = await db.query(`INSERT INTO votes (user_id, post_id, upvote)
                                VALUES ($1,$2,0)`, [username, washroomId])
    }

    static async removeVote ({voteId}){
        const result = await db.query(`DELETE FROM votes WHERE id = $1 `, [voteId])
    }

}

module.exports = Vote