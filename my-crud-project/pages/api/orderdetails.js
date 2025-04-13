const db = require('../../lib/db'); // Ensure proper path to db.js

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Fetch all order details
      const result = await db.query(
        'SELECT orderdetailid, orderid, productid, quantity FROM orderdetails'
      );
      res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      // Create a new order detail
      const { orderid, productid, quantity } = req.body;

      // Validate input fields
      if (!orderid || !productid || !quantity) {
        return res
          .status(400)
          .json({ error: 'Fields orderid, productid, and quantity are required.' });
      }

      const result = await db.query(
        'INSERT INTO orderdetails (orderid, productid, quantity) VALUES ($1, $2, $3) RETURNING orderdetailid, orderid, productid, quantity',
        [orderid, productid, quantity]
      );
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      // Update an existing order detail
      const { orderdetailid, orderid, productid, quantity } = req.body;

      // Validate input fields
      if (!orderdetailid || !orderid || !productid || !quantity) {
        return res.status(400).json({
          error: 'Fields orderdetailid, orderid, productid, and quantity are required.',
        });
      }

      const result = await db.query(
        'UPDATE orderdetails SET orderid=$1, productid=$2, quantity=$3 WHERE orderdetailid=$4 RETURNING orderdetailid, orderid, productid, quantity',
        [orderid, productid, quantity, orderdetailid]
      );
      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      // Delete an order detail
      const { orderdetailid } = req.query;

      // Validate input fields
      if (!orderdetailid) {
        return res.status(400).json({ error: 'Orderdetailid is required.' });
      }

      await db.query('DELETE FROM orderdetails WHERE orderdetailid=$1', [orderdetailid]);
      res.status(200).send({ message: 'Order detail deleted successfully' });
    } else {
      // Handle unsupported HTTP methods
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    // Graceful error handling
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
