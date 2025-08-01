const pool = require("./config");

// Function to generate a random alphanumeric string
function generateRandomString(length = 12) {
    const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterSet.length);
        randomString += characterSet[randomIndex];
    }

    return randomString;
}

// Async function used to insert the URL into the DB
async function insertUrl(url) {
    console.log('insertUrl called with:', url);
    let randomId;
    let success = false;

    while (!success) {
        randomId = generateRandomString();
        try {
            await pool.query("INSERT INTO links (url, trimmedUrl) VALUES (?, ?)", [url, randomId]);
            success = true;
        } catch (err) {
            console.error('Insert error:', err);
            if (err.code !== 'ER_DUP_ENTRY') throw err;
        }
    }

    return randomId;
}

module.exports = {
    generateRandomString,
    insertUrl,
};