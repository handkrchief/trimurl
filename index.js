const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const pool = require('./server/config');
const insertUrl = require('./server/functions');

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/trim', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    try {
        const trimmedUrl = await insertUrl(url);
        res.status(201).json({ trimmedUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create trimmed URL' });
    }
});

// Redirect route
app.get('/:trimmedUrl', async (req, res) => {
    const { trimmedUrl } = req.params;
    try {
        const [rows] = await pool.query('SELECT url FROM links WHERE trimmedUrl = ?', [trimmedUrl]);
        if (rows.length === 0) {
            return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
        }
        res.redirect(rows[0].url);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal DB error');
    }
});

app.listen(2000, () => {
    console.log('Server running at http://localhost:2000');
});
