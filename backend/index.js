const express = require("express");
const cors = require('cors');
const app = express();
const pool = require("./config");
const path = require('path');
const { insertUrl } = require("./functions");

app.use(cors());
app.use(express.json());

app.post('/trim', async (req, res) => {
    console.log('POST /trim hit');
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

app.get('/:trimmedUrl', async (req, res) => {
    const { trimmedUrl } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT url FROM links WHERE trimmedUrl = ?',
            [trimmedUrl]
        );

        if (rows.length === 0) {
            return res.status(404).sendFile(path.join(__dirname, '404.html'));
        }

        const originalUrl = rows[0].url;
        res.redirect(originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal DB error');
    }
});

app.listen(2000, () => {
    console.log("Express server is running and listening");
});
