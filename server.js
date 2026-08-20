require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Paynow } = require('paynow');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const INTEGRATION_ID = process.env.PAYNOW_INTEGRATION_ID;
const INTEGRATION_KEY = process.env.PAYNOW_INTEGRATION_KEY;

if (!INTEGRATION_ID || !INTEGRATION_KEY) {
    console.warn("WARNING: PAYNOW_INTEGRATION_ID or PAYNOW_INTEGRATION_KEY is not set in environment variables. Payments may not work correctly.");
}

let paynow = new Paynow(INTEGRATION_ID || 'dummy-id', INTEGRATION_KEY || 'dummy-key');

paynow.resultUrl = "http://localhost:3000/api/paynow/update";
paynow.returnUrl = "http://localhost:3000/return";

app.post('/api/paynow/initiate', async (req, res) => {
    try {
        const { amount, method, phone, email, reference } = req.body;

        let payment = paynow.createPayment(reference || ("TXN" + Date.now()), email || "test@example.com");
        payment.add("Viewing Request Payment", parseFloat(amount));

        if (method === 'ecocash' || method === 'onemoney') {
            const response = await paynow.sendMobile(payment, phone || '0771111111', method);
            return res.json(response);
        } else {
            const response = await paynow.send(payment);
            return res.json(response);
        }
    } catch (error) {
        console.error("Paynow Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/paynow/update', (req, res) => {
    console.log("Paynow Update:", req.body);
    res.sendStatus(200);
});

app.get('/return', (req, res) => {
    res.send('Payment Return Page');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
