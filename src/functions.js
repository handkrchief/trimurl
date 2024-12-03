import { supabase } from './supabaseClient'

function trimUrl(originalUrl) {
    // We've already checked if the URL is valid in the button itself, but we'll check it again here.
    if (!isValidURL(originalUrl)) {
        return 'Invalid URL'
    // If the URL is valid, we'll generate a new unique ID for the shortened URL and insert it into the database and return the shortened URL.
    } else {
        generateUniqueID()


    }
}

function redirectToOriginal(shortCode) {

}

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

}
export { trimUrl, redirectToOriginal }

