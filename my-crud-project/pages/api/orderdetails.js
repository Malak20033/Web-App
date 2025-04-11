import { db } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Read all order details
    const result = await db.query('SELECT * FROM orderdetails');
    res.status(200).json(result.rows);
  } else if (req.method === 'POST') {
    // Create a new order detail
    const { orderid, productid, quantity } = req.body;
    const result = await db.query(
      'INSERT INTO orderdetails (orderid, productid, quantity) VALUES ($1, $2, $3) RETURNING *',
      [orderid, productid, quantity]
    );
    res.status(201).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    // Update an existing order detail
    const { orderdetailid, orderid, productid, quantity } = req.body;
    const result = await db.query(
      'UPDATE orderdetails SET orderid=$1, productid=$2, quantity=$3 WHERE orderdetailid=$4 RETURNING *',
      [orderid, productid, quantity, orderdetailid]
    );
    res.status(200).json(result.rows[0]);
  } else if (req.method === 'DELETE') {
    // Delete an order detail
    const { orderdetailid } = req.query;
    await db.query('DELETE FROM orderdetails WHERE orderdetailid=$1', [orderdetailid]);
    res.status(200).send({ message: 'Order detail deleted successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
