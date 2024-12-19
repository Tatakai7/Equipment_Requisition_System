const sql = require('mssql');
const dbconfig = require('../../../db/dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.port || 4000;

app.use(express());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));

app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}))

async function addInventory(req, res) {
    const { equipment, date, quantity } = req.body;

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        const formattedDate = new Date(date).toISOString().split('T')[0];

        request.input('addEq', sql.VarChar, equipment);
        request.input('addDate', sql.DateTime, formattedDate);
        request.input('addqty', sql.Int, quantity);
        const query = "INSERT INTO tbl_inv (inv_eq, inv_date, inv_qty) VALUES (@addEq, @addDate, @addqty)";
        await request.query(query);

        res.status(201).send({ message: 'Inventory added successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        await sql.close();
    }
}

module.exports = { addInventory }; // addInventory;