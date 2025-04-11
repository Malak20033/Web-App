import { db } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Read all orders
    const result = await db.query('SELECT * FROM orders');
    res.status(200).json(result.rows);
  } else if (req.method === 'POST') {
    // Create a new order
    const { customerid, order_date, total_price } = req.body;
    const result = await db.query(
      'INSERT INTO orders (customerid, order_date, total_price) VALUES ($1, $2, $3) RETURNING *',
      [customerid, order_date, total_price]
    );
    res.status(201).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    // Update an existing order
    const { orderid, customerid, order_date, total_price } = req.body;
    const result = await db.query(
      'UPDATE orders SET customerid=$1, order_date=$2, total_price=$3 WHERE orderid=$4 RETURNING *',
      [customerid, order_date, total_price, orderid]
    );
    res.status(200).json(result.rows[0]);
  } else if (req.method === 'DELETE') {
    // Delete an order
    const { orderid } = req.query;
    await db.query('DELETE FROM orders WHERE orderid=$1', [orderid]);
    res.status(200).send({ message: 'Order deleted successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}