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

async function removeEmployee(req, res) {
    const { emp_id } = req.body;

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('empId', sql.Int, emp_id);
        const result = await request.query("SELECT acc_id FROM tbl_emp WHERE emp_id = @empId");

        if (result.recordset.length === 0) {
            res.status(404).send({ message: 'Employee not found' });
            return;
        }
        const accId = result.recordset[0].acc_id;

        const query = "DELETE FROM tbl_emp WHERE emp_id = @empId";
        await request.query(query);

        request.input('accId', sql.Int, accId);
        const query2 = "DELETE FROM tbl_acc WHERE acc_id = @accId";
        await request.query(query2);

        res.status(201).send({ message: 'Employee removed successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        await sql.close();
    }
}

module.exports = { removeEmployee };