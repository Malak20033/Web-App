const db = require('../../lib/db'); // Ensure proper path to db.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Read all products
    const result = await db.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } else if (req.method === 'POST') {
    // Create a new product
    const { name, description, price } = req.body;
    const result = await db.query(
      'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    res.status(201).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    // Update an existing product
    const { productid, name, description, price } = req.body;
    const result = await db.query(
      'UPDATE products SET name=$1, description=$2, price=$3 WHERE productid=$4 RETURNING *',
      [name, description, price, productid]
    );
    res.status(200).json(result.rows[0]);
  } else if (req.method === 'DELETE') {
    // Delete a product
    const { productid } = req.query;
    await db.query('DELETE FROM products WHERE productid=$1', [productid]);
    res.status(200).send({ message: 'Product deleted successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
