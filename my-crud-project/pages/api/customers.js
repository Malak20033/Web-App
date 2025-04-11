const db = require('../../lib/db'); // Ensure proper path to db.js

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Read all customers
      const result = await db.query('SELECT * FROM customers');
      res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      // Create a new customer
      const { firstname, lastname, email } = req.body;

      // Check if required fields are provided
      if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const result = await db.query(
        'INSERT INTO customers (firstname, lastname, email) VALUES ($1, $2, $3) RETURNING *',
        [firstname, lastname, email]
      );
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      // Update an existing customer
      const { customerid, firstname, lastname, email } = req.body;

      // Check if required fields are provided
      if (!customerid || !firstname || !lastname || !email) {
        return res.status(400).json({ error: 'All fields including customer ID are required.' });
      }

      const result = await db.query(
        'UPDATE customers SET firstname=$1, lastname=$2, email=$3 WHERE customerid=$4 RETURNING *',
        [firstname, lastname, email, customerid]
      );
      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      // Delete a customer
      const { customerid } = req.query;

      // Check if customer ID is provided
      if (!customerid) {
        return res.status(400).json({ error: 'Customer ID is required.' });
      }

      await db.query('DELETE FROM customers WHERE customerid=$1', [customerid]);
      res.status(200).send({ message: 'Customer deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
