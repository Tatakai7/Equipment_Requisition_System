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

async function approveRequest(req, res) {
    const { reqId, reqEq, reqQty } = req.body;
    try {
        const pool = await sql.connect(dbconfig);
        const request = new sql.Request(pool);

        // Check if the equipment exists and get the current inventory quantity
        request.input('reqEq', sql.VarChar, reqEq);
        const resultqty = await request.query("SELECT inv_qty FROM tbl_inv WHERE inv_eq = @reqEq");

        if (resultqty.recordset.length === 0) {
            return res.status(404).json({ error: 'Equipment not found in inventory' });
        }

        const invQty = resultqty.recordset[0].inv_qty;

        if (invQty === 0) {
            return res.status(400).json({ error: 'Equipment out of stock, try again later.' });
        } else if (invQty < reqQty) {
            return res.status(400).json({ error: 'Not enough quantity in stock.' });
        }

        // Deduct the requested quantity from the inventory
        request.input('newInvQty', sql.Int, invQty - reqQty);
        await request.query("UPDATE tbl_inv SET inv_qty = @newInvQty WHERE inv_eq = @reqEq");

        // Update the request status to approved
        request.input('reqID', sql.Int, reqId);
        const result = await request.query("UPDATE tbl_req SET req_status = 'Approved', read_stat = 'unread' WHERE req_id = @reqID");

        res.json({ message: 'Request approved successfully!' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { approveRequest };
