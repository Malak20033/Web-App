const pool = require('../db'); // Links to your database.js file

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()'); // Check current time in database
    console.log('Connected to database successfully! Current time:', result.rows[0].now);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    pool.end(); // Close the connection pool
  }
}

testConnection();