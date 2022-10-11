const { BCRYPT_WORK_FACTOR, DB_URI } = require('../config')
const ExpressError = require('../helpers/expressErrors')
const db = require('../db')



class Washroom {

    // Get all washrooms in DB
    static async getAll() {
        const washrooms = await db.query(`SELECT id, washroom_type, user_id,x_coordinate, y_coordinate,opens_at,closes_at
                                          FROM submitted_washrooms`)

        return washrooms.rows
    }



    // Submit new washroom to the DB. 
    static async submitNewWahsroom({ washroomInfo, username }) {
        const { washroomType, xCoordinate, yCoordinate, opensAt, closesAt } = washroomInfo;

        const result = await db.query(`INSERT INTO submitted_washrooms (washroom_type, user_id,x_coordinate, y_coordinate,opens_at, closes_at)
                                        VALUES ($1,$2,$3,$4,$5,$6)
                                        RETURNING id`,
            [washroomType, username, xCoordinate, yCoordinate, opensAt, closesAt])
        
        await db.query(`INSERT INTO votes (user_id, post_id, upvote)
                        VALUES ($1,$2,1)`, [username, result.rows[0].id])
        return result.rows[0]
    }

    // Get washroom based off of coordinates as filter
    static async getFilteredWashrooms(searchParams) {
        const { type, minX, maxX, minY, maxY, opensAt, closesAt } = searchParams;

        let queryString = `x_coordinate >= ${minX} AND x_coordinate <= ${maxX} AND y_coordinate >= ${minY} AND y_coordinate <=${maxY} 
                            ${type ? `AND washroom_type LIKE '%${type}%'` : ''} ${opensAt ? `AND opens_at = ${opensAt}` : 'AND opens_at IS NULL'} ${closesAt ? `AND closes_at = ${closesAt}` : 'AND closes_at IS NULL'}`


        const result = await db.query(`SELECT id, washroom_type, x_coordinate, y_coordinate,opens_at,closes_at
                                        FROM submitted_washrooms
                                        WHERE ${queryString}`)

        return result.rows

    }

    static async getSpecificWashroom(washroomId) {

        const result = await db.query(`SELECT submitted_washrooms.user_id, washroom_type, x_coordinate, y_coordinate, opens_at, closes_at, SUM(votes.upvote) AS total_votes
                                    FROM submitted_washrooms
                                    JOIN votes ON (post_id = submitted_washrooms.id)
                                    WHERE submitted_washrooms.id = ${washroomId}
                                    GROUP BY submitted_washrooms.id`)

        return result.rows
    }

    static async deleteWashroom(washroomId) {

        const result = await db.query(`DELETE FROM submitted_washrooms WHERE id = $1`, [washroomId])
        console.log('result')
        return result.rows
    }

    static async modifyWashroom({ washroomInfo, washroomId }) {
        const { opensAt, closesAt, washroomType } = washroomInfo;
        const setCols = `${opensAt ? `opens_at = '${opensAt}',` : ''} ${closesAt ? `closes_at = '${closesAt}',` : ''} ${washroomType ? `washroom_type = '${washroomType}'` : ''}`
        const result = await db.query(`UPDATE submitted_washrooms
                                        SET ${setCols}
                                        WHERE id = ${washroomId}`)
    }
}

module.exports = Washroom