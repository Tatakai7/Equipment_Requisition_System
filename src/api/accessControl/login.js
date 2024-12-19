require('dotenv').config();
const sql = require('mssql');
const dbconfig = require('../../db/dbconfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));

app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}));


async function handleLogin(req, res) {
    const { username, password } = req.body;

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('username', sql.VarChar, username);

        const result = await request.query("SELECT acc_id, username, password, usertype FROM tbl_acc WHERE username = @username");

        if (result.recordset.length > 0) {
            const { acc_id, username, usertype } = result.recordset[0];
            const hashedPass = result.recordset[0].password;
            const match = await bcrypt.compare(password, hashedPass);

            if (match) {
                request.input('acc_id', sql.Int, acc_id);
                const employeeResult = await request.query("SELECT emp_id, acc_id FROM tbl_emp WHERE acc_id = @acc_id");
                const emp_id = employeeResult.recordset.length > 0 ? employeeResult.recordset[0].emp_id : null;

                const user = { emp_id, acc_id, username, usertype };
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}

module.exports = { handleLogin };