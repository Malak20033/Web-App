const db = require('../../lib/db'); // Ensure proper path to db.js

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Read all orders
      const result = await db.query(
        'SELECT orderid, customerid, orderdate, status FROM orders'
      );
      res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      // Create a new order
      const { customerid, orderdate, status } = req.body;

      if (!customerid || !orderdate || !status) {
        return res.status(400).json({
          error: 'Fields customerid, orderdate, and status are required.',
        });
      }

      const result = await db.query(
        'INSERT INTO orders (customerid, orderdate, status) VALUES ($1, $2, $3) RETURNING orderid, customerid, orderdate, status',
        [customerid, orderdate, status]
      );
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      // Update an existing order
      const { orderid, customerid, orderdate, status } = req.body;

      if (!orderid || !customerid || !orderdate || !status) {
        return res.status(400).json({
          error: 'Fields orderid, customerid, orderdate, and status are required.',
        });
      }

      const result = await db.query(
        'UPDATE orders SET customerid=$1, orderdate=$2, status=$3 WHERE orderid=$4 RETURNING orderid, customerid, orderdate, status',
        [customerid, orderdate, status, orderid]
      );
      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      // Delete an order
      const { orderid } = req.query;

      if (!orderid) {
        return res.status(400).json({ error: 'Orderid is required.' });
      }

      await db.query('DELETE FROM orders WHERE orderid=$1', [orderid]);
      res.status(200).send({ message: 'Order deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
