const sql = require('mssql');
const dbconfig = require('../../../db/dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.port || 4000;

app.use(express());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));

app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}));

async function addEmployee(req, res) {
    const { fullname, dept, email, phonenum, usertype, username, password } = req.body;


    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('addUser', sql.VarChar, username);
        const checkQuery = "SELECT * FROM tbl_acc WHERE username = @addUser";
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ errrorMessage: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        request.input('signUser', sql.VarChar, username);
        request.input('password', sql.VarChar, hashedPassword);
        request.input('usertype', sql.VarChar, usertype);
        const accInsertQuery = "INSERT INTO tbl_acc (username, password, usertype) VALUES (@signUser, @password, @usertype)";
        await request.query(accInsertQuery);

        const insertedUserQuery = "SELECT acc_id FROM tbl_acc WHERE username = @signUser";
        const insertedUserResult = await request.query(insertedUserQuery);
        const acc_id = insertedUserResult.recordset[0].acc_id;

        request.input('empFullname', sql.VarChar, fullname);
        request.input('empDept', sql.VarChar, dept);
        request.input('empEmail', sql.VarChar, email);
        request.input('empPhonenum', sql.VarChar, phonenum);
        request.input('userId', sql.Int, acc_id);
        const empInsertQuery = "INSERT INTO tbl_emp (emp_fn, emp_dept, emp_email, emp_phone, acc_id) VALUES (@empFullname, @empDept, @empEmail, @empPhonenum, @userId)";
        await request.query(empInsertQuery);

        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        // Close database connection
        await sql.close();
    }
}


module.exports = { addEmployee };
