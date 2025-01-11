// Helper function to validate URLs server side
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Function to generate a random alphanumeric string
function getRandomString(length) {
    const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterSet.length);
        randomString += characterSet[randomIndex];
    }

    return randomString;
}

// Check if a short code already exists within the database
async function checkIfUrlExists(shortCode, db) {
    const result = await db.collection("urls").findOne({ short_code: shortCode });
    return result !== null;
}

// Generate a unique short code
async function generateUniqueID(db, length = 5) {
    let randomString = getRandomString(length);

    while (await checkIfUrlExists(randomString, db)) {
        randomString = getRandomString(length + 1);
    }

    return randomString;
}

module.exports = {
    isValidURL,
    getRandomString,
    checkIfUrlExists,
    generateUniqueID,
};