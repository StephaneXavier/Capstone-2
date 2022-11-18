require("dotenv").config();


const PORT = +process.env.PORT || 5000;

let DB_URI;

if (process.env.NODE_ENV === 'test') {
	DB_URI = 'postgresql:///gotta_go_test';
} else {
	DB_URI = process.env.DATABASE_URL || 'postgresql:///gotta_go';
}

const SECRET_KEY = process.env.SECRET_KEY || "secret";


const BCRYPT_WORK_FACTOR = (process.env.NODE_ENV === 'test')
    ? 1 
    : 12

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  PORT
};