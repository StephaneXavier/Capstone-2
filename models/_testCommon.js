const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
const testWashroomIds= [];
async function commonBeforeAll(){
    await db.query("DELETE FROM submitted_washrooms");
    await db.query("DELETE FROM users");
    await db.query("DELTE FROM votes");

    await db.query(`
    INSERT INTO users (username, password, join_at)
    VALUES ('u1', 'pwd1', '2011-01-01'),
            ('u2', 'pwd2', '2011-02-02'),
            ('u3', 'pwd3', '2011-03-03');
            `);

    const resultWashrooms = await db.query(`
    INSERT INTO submitted_washrooms (washroom_type, user_id, x_coordinate,y_coordinate, opens_at, closes_at)
    VALUES ('porta-potty', 'u1',45.01, 55.12, '1200','1500'),
        ('gas-station', 'u2',46.03,-54.14, '0600','2100'),
        ('porta-potty', 'u3',45.06, -45.15, '','');
    RETURNING id
    `);
   testWashroomIds.splice(0,0, ...resultWashrooms.rows(elem => elem.id))

    await db.query(`
    INSERT INTO votes (user_id,post_id,upvote)
    VALUES ('u1',1,1),
        ('u1',2,0),
        ('u2',3,1),
        ('u2',1,1);
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
    commonBeforeEach
  }