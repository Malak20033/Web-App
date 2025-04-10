const express = require("express");
const router = express.Router();
const pool = require("./db"); // Connection to the database.

// Customers CRUD
router.get("/customers", async (req, res) => {
    try {
        const customers = await pool.query("SELECT * FROM customers");
        res.json(customers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post("/customers", async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        await pool.query(
            "INSERT INTO customers (firstname, lastname, email) VALUES ($1, $2, $3)",
            [firstname, lastname, email]
        );
        res.send("Customer Added");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Add PUT route to update customer by ID
router.put("/customers/:id", async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        const { id } = req.params;

        await pool.query(
            "UPDATE customers SET firstname=$1, lastname=$2, email=$3 WHERE customerid=$4",
            [firstname, lastname, email, id]
        );
        res.send("Customer Updated");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;