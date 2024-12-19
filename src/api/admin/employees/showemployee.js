const sql = require('mssql');
const dbconfig = require('../../../db/dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}));


async function showEmployees(req, res) {
    try {

        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);
        const result = await request.query("SELECT tbl_emp.emp_id, tbl_emp.emp_fn, tbl_emp.emp_dept, tbl_emp.emp_email, tbl_emp.emp_phone, tbl_acc.acc_id, tbl_acc.username, tbl_acc.usertype FROM tbl_emp INNER JOIN tbl_acc ON tbl_emp.acc_id=tbl_acc.acc_id WHERE tbl_acc.usertype = 'user'");

        res.json(result.recordset);

    } catch (error) {
        console.log(error);
    }

};

module.exports = { showEmployees };