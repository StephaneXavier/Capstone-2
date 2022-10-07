const { BCRYPT_WORK_FACTOR, DB_URI } = require('../config')
const ExpressError = require('../helpers/expressErrors')
const db = require('../db')



class Washrooms{

    // Get all washrooms in DB
    static async get(){
        const washrooms = await db.query(`SELECT * FROM submitted_washrooms`)

        return washrooms.rows
    }


    static async submitNewWahsroom({username, washroomInfo}){
        const {washroomType, xYCoordinates, opensAt, closesAt} = washroomInfo;

        const result = await db.query(`INSERT INTO submitted_washrooms (washroom_type, user_id,x_y_coordinates,opens_at, closes_at)
                                        VALUES ($1,$2,$3,$4,$5)
                                        RETURNING (washroom_type, x_y_coordinates, opens_at, closes_at)`,
                                        [washroomType, username, xYCoordinates, opensAt, closesAt])
                    
        return result.rows[0]
    }

    
    static async getFilteredWashrooms(coordinates){
        const {minX, maxX, minY, maxY} = coordinates;
        

    }
}