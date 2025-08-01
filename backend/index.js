const express = require("express");
const cors = require('cors');
const app = express();
const pool = require("./config");
const { insertUrl } = require("./functions");

app.use(cors());
app.use(express.json());

app.post('/trim', async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: 'Missing URL'});

    try {
        const trimmedUrl = await insertUrl(url);
        res.status(201).json({trimmedUrl: trimmedUrl});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create trimmed URL' });
    }
});

app.listen(2000, () => {
    console.log("Express server is running and listening");
});
