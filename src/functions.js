import { supabase } from './supabaseClient'

export { trimUrl, redirectToOriginal }

function trimUrl(originalUrl) {
    // We've already checked if the URL is valid in the button itself, but we'll check it again here.
    if (!isValidURL(originalUrl)) {
        return 'Invalid URL'
    }
    let shortCode;
    // If the URL is valid, we'll check if it already exists within the database and return the short code if it does.
    // OTHERWISE, we'll generate a new one. -> insert into db return short code for readonly field
    if (!checkIfUrlExists(originalUrl)) {
        shortCode = generateUniqueID();
        // insert into db with new shortCode into short_code originalUrl in original_url
        insertUrl(originalUrl, shortCode);
    } else {
        // return the short_code that corresponds to the given originalUrl
        shortCode = getShortCodeFromOriginal(originalUrl);
    }
    return shortCode;
}

// This function will be for returning a originalUrl given the shortCode passed in (redirection for trimmed links)
function redirectToOriginal(shortCode) {

}

// It's important to mention this doesn't guarantee uniqueness, but it's highly unlikely to generate the same string twice.
// We'll consider implementing something more robust in the future.
// Maybe just look into turning it into a recursive function that keeps generating new strings until it finds a unique one.
function generateUniqueID() {
    // We'll generate a random string of 5 characters.
    const length = 5
    let randomString = getRandomString(length)
    // We'll check if the generated string already exists within the database.
    if (!checkIfUrlExists(randomString)) {
        // If it doesn't exist within the database, we'll return it as it's unique.
        return randomString
    } else {
        // If it exists within the database, we'll generate a new one with length + 1.
        randomString = getRandomString(length + 1)
    }
    return randomString
}

function getRandomString(length) {
    // Our character set, which is the base for generating the random string is 62 characters long.
    const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomString = ''

    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        // First we'll declare a typed array of 32-bit unsigned integers of the given length. (0-255)
        const array = new Uint32Array(length)
        // We'll fill the array with random values.
        window.crypto.getRandomValues(array)
        // We'll loop through the array and generate the random string.
        array.forEach((value, index) => {
        // Looking for the remainder of the value divided by the length of the character set. (It'll never be over 62)
        array[index] = value % characterSet.length
        // We'll add the character at the given index to the random string.
        randomString += characterSet[array[index]]
    })
    } else {
        // If the browser doesn't support the crypto API, we'll use Math.random.
        for (let i = 0; i < length; i++) {
            // We'll generate a random number between 0 and the length of the character set.
            const randomIndex = Math.floor(Math.random() * characterSet.length)
            // We'll add the character at the given index to the random string.
            randomString += characterSet[randomIndex]
        }
    }
    return randomString
}

function isValidURL(string) {
    try {
        new URL(string)
        return true
    } catch (error) {
        return false
    }
}

async function checkIfUrlExists(url) {
    try {
        // How to query the database to check for a values existance
        const { data, error } =  await supabase
            .from('urls')
            .select('original_url')
            .eq('original_url', url);

        if (error) {
            throw error;
        }

        // Check if data is returned
        if (data.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

async function getShortCodeFromOriginal(originalUrl) {
    try {
        const { data, error } = await supabase
            .from('urls')
            .select('short_code')
            .eq('original_url', originalUrl);

        if (error) {
            throw error;
        }

        if (data.length > 0) {
            return data[0].short_code;
        }
    } catch (err) {
        console.error('Error fetching short_code:', err.message);
        return null;
    }
}

async function insertUrl(originalUrl, shortCode) {
    try {
        const { data, error } =  await supabase
            .from('urls')
            .insert([
                {
                    original_url: originalUrl,
                    short_code: shortCode,
                    timestamp: new Date().toISOString() // current timestamp
                }
            ]);
        if (error) {
            throw error;
        }
    } catch (err) {
        console.error('Error inserting data:', err.message);
    }
}


