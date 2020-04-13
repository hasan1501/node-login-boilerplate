require('dotenv').config()
const database_url = process.env.DATABASE_URL;

const {Pool} = require('pg');

const pool = new Pool({connectionString: database_url});

module.exports = pool;