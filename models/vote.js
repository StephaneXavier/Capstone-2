const ExpressError = require('../helpers/expressErrors')
const db = require('../db')

class Vote {
    // constructor(){
    //     this.submittVote = this.submittVote.bind(this)
    //     this.getVote = this.getVote.bind(this)
    // }

    static async getVote({ washroomId, username }) {
        
        const result = await db.query(`SELECT * FROM votes WHERE post_id = $1 AND user_id = $2`, [washroomId, username])
        
        return result.rows[0]
    }


    static async submittVote({ washroomId, username, voteType }) {
        
        const isThereVoteAlready = await Vote.getVote({ washroomId, username });
        const voteTypeNum = voteType === 'upvote' ? 1 : 0;
        if (isThereVoteAlready) {
            if (isThereVoteAlready.upvote === voteTypeNum) throw new ExpressError(`can't ${voteType} twice`)
            const res = await Vote.updateVote({washroomId, currentVote : isThereVoteAlready.upvote, username})
            return res.rows
        }
        if(voteType === 'upvote') return await Vote.upvote({washroomId, username})
        if(voteType === 'downvote') return await Vote.downvote({washroomId, username})
    }


    static async updateVote({ washroomId, currentVote, username }) {
        const newVote = currentVote === 1 ? 0 : 1;
        const res = await db.query(`UPDATE votes SET upvote = $1 WHERE post_id = $2 AND user_id = $3
                                    RETURNING id, post_id, user_id, upvote`, [newVote, washroomId, username])
        return res.rows
    }



    static async upvote({ washroomId, username }) {
        const result = await db.query(`INSERT INTO votes (user_id, post_id, upvote)
                                VALUES ($1,$2,1)
                                RETURNING id, user_id,post_id,upvote`, [username, washroomId])
        return result.rows[0]
    }



    static async downvote({ washroomId, username }) {

        const result = await db.query(`INSERT INTO votes (user_id, post_id, upvote)
                                VALUES ($1,$2,0)
                                RETURNING id, user_id,post_id,upvote`, [username, washroomId])
        return result.rows[0]
    }



    static async removeVote({ washroomId, username }) {

        const result = await db.query(`DELETE FROM votes WHERE post_id = $1 AND user_id= $2 RETURNING id`, [washroomId, username])

        

    }

}

module.exports = Vote