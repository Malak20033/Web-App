const express = require('express');
const pool = require('../lib/db'); // Adjust the path to your `database.js`

const app = express();
const PORT = 3000; // Use a port different from 3000 to avoid conflicts

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World! Your server is running.');
});

app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send('Error fetching customers.');
  }
});

app.post('/customers', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).send('Customer added successfully.');
  } catch (error) {
    res.status(500).send('Error adding customer.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});