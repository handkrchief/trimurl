function trimUrl(originalUrl) {

}

function redirectToOriginal(shortCode) {

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

export { trimUrl, redirectToOriginal }

