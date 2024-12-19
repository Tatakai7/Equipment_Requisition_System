const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sql = require('mssql');
const dbconfig = require('../../../db/dbconfig');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}));

async function resetPass(req, res) {
    const { acc_id, newPassword } = req.body;

    const lowercasepass = newPassword.toLowerCase();

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(lowercasepass, salt);

        request.input('accID', sql.Int, acc_id);
        request.input('password', sql.VarChar, hashPassword);
        const result = await request.query("UPDATE tbl_acc SET password = @password WHERE acc_id = @accID");

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ success: true, message: 'Password reset successfully!' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to reset password. Account ID not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while resetting password.' });
    }
}

module.exports = { resetPass };

