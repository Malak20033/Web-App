const { Pool } = require('pg');
require('dotenv').config({ path: 'C:\\Users\\malak\\project-1-web-app-Malak20033\\my-crud-project\\.env' });

let pool;

try {
    // Initialize the database connection pool
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    console.log("Database pool initialized successfully!");
} catch (err) {
    // Catch and log any errors during initialization
    console.error("Error initializing database pool:", err.message);
    process.exit(1); // Exit the app if the database connection fails
}

// Export the query method for cleaner usage in other files
module.exports = {
    query: (text, params) => pool.query(text, params),
};