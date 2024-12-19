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


async function showAdminNotif(req, res) {
    try {

        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);
        const result = await request.query("SELECT * FROM tbl_req WHERE req_status = 'Pending'");

        res.json(result.recordset);

    } catch (error) {
        console.log(error);
    }

};

module.exports = { showAdminNotif };