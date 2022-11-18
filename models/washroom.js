const { BCRYPT_WORK_FACTOR, DB_URI } = require('../config')
const ExpressError = require('../helpers/expressErrors')
const db = require('../db')



class Washroom {

    // Get all washrooms in DB [{id, washroom_type, user_id, longitude, latitude, opens_at, closes_at}...]
    static async getAll() {
        const washrooms = await db.query(`SELECT id, washroom_type, user_id,longitude, latitude,opens_at,closes_at
                                          FROM submitted_washrooms`)

        return washrooms.rows
    }



    // Submit new washroom to the DB. 
    static async submitNewWahsroom({ washroomInfo, username }) {
        const { washroomType, longitude, latitude, opensAt, closesAt } = washroomInfo;

        const result = await db.query(`INSERT INTO submitted_washrooms (washroom_type, user_id,longitude, latitude,opens_at, closes_at)
                                        VALUES ($1,$2,$3,$4,$5,$6)
                                        RETURNING id`,
            [washroomType, username, longitude, latitude, opensAt, closesAt])
        
        
        await db.query(`INSERT INTO votes (user_id, post_id, upvote)
                        VALUES ($1,$2,1)`, [username, result.rows[0].id])
        return result.rows[0].id
    }

    static allOrNoCoords(coordinates){
        const {minX, maxX, minY, maxY} = coordinates;
        let coordTracker = 0;
        
        [minX, maxX, minY, maxY].forEach(coord => {
            if(coord)coordTracker ++
        });

        if(![0,4].some(e => e === coordTracker)) return false

        return true
    }

    // Get washroom based off of coordinates as filter. Must either have all 4 coords or none.
    static async getFilteredWashrooms(searchParams) {
        if(Object.keys(searchParams).length === 0) throw new ExpressError('must provide search params');

        const { washroomType, minX, maxX, minY, maxY, opensAt, closesAt } = searchParams;
        const whereExpressions = [];
        const queryValues = [];
        let query = `SELECT id, washroom_type, longitude, latitude,opens_at,closes_at
                     FROM submitted_washrooms
                     WHERE `
        
        const allCoordsInParams =  Washroom.allOrNoCoords({minX, maxX, minY, maxY})
        
        if(!allCoordsInParams) throw new ExpressError('Either put min / max for x and y axis, or omit coordinates')
        
        if(washroomType){
            queryValues.push(washroomType)
            whereExpressions.push(`washroom_type LIKE '%${washroomType}%'`)
        }
        
        if(opensAt){
            queryValues.push(opensAt)
            whereExpressions.push(`opens_at = ${opensAt}`)
        }
        if(closesAt){
            queryValues.push(closesAt)
            whereExpressions.push(closesAt)
        }
        
        if(maxX){
            queryValues.push(minX, maxX, minY, maxY)
            whereExpressions.push(`longitude >= ${minX} AND longitude <= ${maxX} AND latitude >= ${minY} AND latitude <= ${maxY}`)
        }
        
        query += whereExpressions.join("AND");
        const result = await db.query(query);
        
        return result.rows
    }

    /* Using washroomId, return {user_id, washroom_type, longitude, latitude, opens_at, closes_at, votes}*/ 
    static async getSpecificWashroom(washroomId) {

        const result = await db.query(`SELECT submitted_washrooms.user_id, washroom_type, longitude, latitude, opens_at, closes_at, SUM(votes.upvote) AS total_votes
                                    FROM submitted_washrooms
                                    JOIN votes ON (post_id = submitted_washrooms.id)
                                    WHERE submitted_washrooms.id = ${washroomId}
                                    GROUP BY submitted_washrooms.id`)

        if(result.rows.length ===0) throw new ExpressError('No washroom matching id', )
        return result.rows[0]
    }

    static async deleteWashroom(washroomId) {

        const result = await db.query(`DELETE FROM submitted_washrooms WHERE id = $1 RETURNING id`, [washroomId])
        if(result.rows.length ===0) throw new ExpressError(`washroom id ${washroomId} does not exist`)
        return result.rows[0]
    }

    static async modifyWashroom({ washroomInfo, washroomId }) {
        await Washroom.getSpecificWashroom(washroomId)
        const { opensAt, closesAt, washroomType } = washroomInfo;
        const setCols = `${opensAt ? `opens_at = '${opensAt}',` : ''} ${closesAt ? `closes_at = '${closesAt}',` : ''} ${washroomType ? `washroom_type = '${washroomType}'` : ''}`
        const result = await db.query(`UPDATE submitted_washrooms
                                        SET ${setCols}
                                        WHERE id = ${washroomId}`)
    }
}

module.exports = Washroom