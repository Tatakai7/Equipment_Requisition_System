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


async function showName(req, res) {
    const { userID } = req.body;
    try {

        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('empID', sql.Int, userID);
        const result = await request.query("SELECT emp_fn FROM tbl_emp WHERE emp_id = @empID");

        res.json(result.recordset);

    } catch (error) {
        console.log(error);
    }

};

module.exports = { showName };