const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
const testWashroomIds= [];
async function commonBeforeAll(){
    
    await db.query("DELETE FROM submitted_washrooms");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM votes");
    
    await db.query(`
    INSERT INTO users (username, password, join_at)
    VALUES ('u1', $1, '2011-01-01'),
            ('u2', $2, '2011-02-02'),
            ('u3', $3, '2011-03-03')`,
            [
                await bcrypt.hash('pwd1', BCRYPT_WORK_FACTOR),
                await bcrypt.hash('pwd2', BCRYPT_WORK_FACTOR),
                await bcrypt.hash('pwd3', BCRYPT_WORK_FACTOR)
            ]);

    const resultWashrooms = await db.query(`
    INSERT INTO submitted_washrooms (washroom_type, user_id, x_coordinate,y_coordinate, opens_at, closes_at)
    VALUES ('porta-potty', 'u1',45.01, 55.12, '1200','1500'),
        ('gas-station', 'u2',46.03,-54.14, '0600','2100'),
        ('porta-potty', 'u1',45.06, -45.15, '','')
    RETURNING id
    `);
   testWashroomIds.splice(0,0, ...resultWashrooms.rows.map(elem => elem.id))

    await db.query(`
    INSERT INTO votes (user_id,post_id,upvote)
    VALUES ('u1',${testWashroomIds[0]},1),
        ('u1',${testWashroomIds[1]},0),
        ('u2',${testWashroomIds[2]},1),
        ('u2',${testWashroomIds[0]},1)
    `);
}

async function commonBeforeEach() {
    
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }

  module.exports = {
    commonAfterAll,
    commonAfterEach,
    commonBeforeAll,
    commonBeforeEach,
    testWashroomIds
  }