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

async function deleteInventory(req, res) {
    const { inv_id } = req.body;

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('addId', sql.Int, inv_id);
        const query = "DELETE FROM tbl_inv WHERE inv_id = @addId";
        await request.query(query);

        res.status(201).send({ message: 'Data Deleted successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        await sql.close();
    }
}

module.exports = { deleteInventory };