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


async function readNotif(req, res) {
    const { notificationId } = req.body;
    try {

        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);
        request.input('userID', sql.Int, notificationId);
        const result = await request.query("UPDATE tbl_req SET read_stat = 'read' WHERE req_id = @userID");

        res.json(result.recordset);

    } catch (error) {
        console.log(error);
    }

};

module.exports = { readNotif };