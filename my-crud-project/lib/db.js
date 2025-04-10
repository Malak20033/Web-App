const { Pool } = require('pg');
require('dotenv').config({ path: 'C:\\Users\\malak\\project-1-web-app-Malak20033\\my-crud-project\\.env' });

console.log("Database URL:", process.env.DATABASE_URL); // Add this line to debug the environment variable.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;