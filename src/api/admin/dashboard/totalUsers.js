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


const totalUsers = async (req, res) => {
    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);
        const result = await request.query("SELECT COUNT(*) as totalUsers FROM tbl_acc WHERE usertype = 'user'");
        const totalUserCount = result.recordset[0].totalUsers;

        res.json({ totalUsers: totalUserCount });
    } catch (error) {
        console.error('Error fetching total users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { totalUsers };