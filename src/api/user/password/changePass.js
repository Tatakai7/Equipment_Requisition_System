const sql = require('mssql');
const dbconfig = require('../../../db/dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

app.use(express());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: 'false' }));

app.use(express.static(path.join(__dirname, 'CaberteMausisaSystem2024')));
app.use(cors({
    origin: 'http://localhost:3000',
}))

async function changePass(req, res) {
    const { accID, oldPassword, newPassword } = req.body;

    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        request.input('userID', sql.Int, accID);
        request.input('oldPass', sql.VarChar, oldPassword);
        const query2 = "SELECT password FROM tbl_acc WHERE acc_id = @userID";
        const result2 = await request.query(query2);

        const hashpass = result2.recordset[0].password
        const match = await bcrypt.compare(oldPassword, hashpass);

        if (!match) {
            return res.status(400).json({ setErrorMessage: 'Invalid old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashNewPass = await bcrypt.hash(newPassword, salt);

        request.input('newPass', sql.VarChar, hashNewPass);
        const query = "UPDATE tbl_acc SET password = @newPass WHERE acc_id = @userID";
        await request.query(query);

        res.status(201).send({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    } finally {
        await sql.close();
    }
}

module.exports = { changePass };