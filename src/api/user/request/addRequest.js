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


async function addRequest(req, res) {
    const { equipment, date, purpose, quantity, userID } = req.body;
    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('addEq', sql.VarChar, equipment);
        request.input('addpurpose', sql.VarChar, purpose);
        request.input('addqty', sql.Int, quantity);
        request.input('addDate', sql.DateTime, date);
        request.input('addEmpID', sql.Int, userID);
        const query = "INSERT INTO tbl_req (req_eq, req_purpose, req_status, req_qty, req_date, emp_id) VALUES (@addEq, @addpurpose, 'Pending', @addqty, @addDate, @addEmpID)";
        await request.query(query);

        res.status(201).send({ message: 'Request added successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        await sql.close();
    }
}

module.exports = { addRequest };