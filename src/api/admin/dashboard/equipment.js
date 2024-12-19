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


async function showDeptEquipment(req, res) {
    try {

        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        const result = await request.query("SELECT emp_dept, COALESCE(SUM(req_qty), 0) AS total_qty FROM tbl_emp LEFT JOIN tbl_req ON tbl_emp.emp_id = tbl_req.emp_id AND req_status = 'Approved' GROUP BY emp_dept");

        res.json(result.recordset);

    } catch (error) {
        console.log(error);
    }

};

module.exports = { showDeptEquipment };