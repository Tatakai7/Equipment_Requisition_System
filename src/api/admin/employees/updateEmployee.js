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

async function updateEmployee(req, res) {
    const { emp_id, fullname, dept, email, phonenum } = req.body;

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('empID', sql.Int, emp_id);
        request.input('empFN', sql.VarChar, fullname);
        request.input('empDEPT', sql.VarChar, dept);
        request.input('empEMAIL', sql.VarChar, email);
        request.input('empPHONE', sql.VarChar, phonenum);
        const query = "UPDATE tbl_emp SET emp_fn = @empFN, emp_dept = @empDEPT, emp_email = @empEMAIL, emp_phone = @empPHONE WHERE emp_id = @empID";
        await request.query(query);

        res.status(201).send({ message: 'Employee updated successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        await sql.close();
    }
}

module.exports = { updateEmployee };