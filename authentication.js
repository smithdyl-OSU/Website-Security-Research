const crypto = require('crypto');

/**
 * A broken version of login which uses the bad practice of telling users
 * why their login failed. Allows malicious attempts at cracking security.
 * @param {string} email
 * @param {string} password
 * 
 * @returns {object} result - either the user's information, retrieved from the database,
 *                   or an error statement in the event of failed login
 * @returns {int} - the HTML status code associated with the login attempt
 */
function brokenLogin(email, password) {
    // Query database for user with supplied email
    result = {};
    if (Object.keys(result).length === 0) {
        return { error: "Login failed: No user with this email exists" }, 404;
    }
    if (result.email === email || result.password !== password) {
        return { error: `Login for user ${result.email}: invalid password` }, 403;
    }

    return result, 200;
}

/**
 * Checks supplied login information against database for a match.
 * @param {string} email - user's email
 * @param {string} password - user's password
 * 
 * @returns {object} result - either the user's information, retrieved from the database,
 *                   or an error statement in the event of failed login
 * @returns {integer} - the HTML status code associated with the login attempt
 */
function login(email, password) {
    // Query database for user with supplied email
    result = {};
    if (Object.keys(result).length === 0) {
        return { error: "Login failed: Invalid userID or password" }, 403;
    }

    if (!compareHashes(password, result.password)) {
        return { error: "Login failed: Invalid userID or password" }, 403;
    }

    return result, 200;
}

/**
 * A poorly designed registration process that leads to broken authentication.
 * @param {string} email - user's email
 * 
 * @returns {bool} - true if registration successful, false otherwise
 */
function brokenReg(email) {
    // Get collection of currently registered emails
    const database = [];
    if (database.includes(email)) {
        return false;
    }

    // Assign standardized password to user?
    return true;
}

/**
 * Checks if the string passed is a valid email.
 * @param {string} email - user's email
 * 
 * @returns {bool} - true if valid email, false otherwise
 */
function validateEmail(email) {
    // Establish the RegEx patterns needed to parse an email
    const specialChars = /@/;
    const localRegex = new RegExp(/.+(?=@)/);
    const domainRegex = new RegExp(/(?<=@).+/);

    // Test if the email contains @.
    if (specialChars.test(email)) {
        // Match the local and domain names and determine their lengths
        const local = email.match(localRegex);
        const domain = email.match(domainRegex);
        const localSize = local[0].length;
        const domainSize = domain[0].length;

        // Check that local and domain names are in appropriate size ranges
        if (localSize > 0 && localSize <= 64 && domainSize > 0 && domainSize <= 255) {
            // Normalize address and check if unique in database
            /*
             ****************************************************************************
             * THIS SECTION WILL NEED TO BE CHANGED ONCE DATABASE IS IN PLACE           *
             ****************************************************************************
             */
            const database = [];
            if (database.includes(local[0] + '@' + domain[0].toLowerCase())) {
                // Email already in use
                return false;
            }

            // Valid email syntax, email available
            return true;
        }
    }

    // Invalid email syntax
    return false;
}

/**
 * Checks if the supplied password is confirmed and meets the security requirements.
 * @param {string} password - User's requested password
 * @param {string} confirm - The user's password confirmation; should === password
 * 
 * @returns {bool} - true if the password meets security standards, false if not or if unconfirmed
 */
function validatePassword(password, confirm) {
    // Password and Confirm Password sections do not match
    if (password !== confirm) {
        return false;
    }

    // Password too short or too long
    if (password.length < 10 || password.length > 128) {
        return false;
    }

    // Build RegEx patterns to test complexity of the password 
    let complexity = 0;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\s]/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const numbers = /[0-9]/
    const tests = [specialChars, upper, lower, numbers];

    // Test each complexity condition
    for (let test of tests) {
        if (test.test(password)) {
            console.log(test);
            complexity += 1;
        }
    }

    // Check that the password meets at least 3 of the 4 complexity conditions
    if (complexity < 3) {
        return false;
    }

    // Check that no two adjacent characters of the password repeat
    const repeat = /(.)\1/;
    if (repeat.test(password)) {
        return false;
    }

    return true;
}

/**
 * Hashes the provided password for secure storage.
 * @param {string} password - user's registered password
 * 
 * @returns {string} protectedForm - the hashed version of the supplied password
 */
function hashPassword(password) {
    // Create the salt to be used in the hashing processes
    const array = new Uint32Array(1);
    const salt = String(crypto.getRandomValues(array)[0]);

    // Hash the password and append to salt
    const protectedForm = salt + protect(salt, password);

    return protectedForm;
}

/**
 * Compares a supplied password against a hashed password. Hashes password
 * using the same salt that protectedForm was hashed with and compares to 
 * protectedForm to see if they are identical.
 * @param {string} password - password used as login attempt
 * @param {string} protectedForm - hashed password for account of login attempt
 * 
 * @returns {bool} - true if hashed password is a match with protectedForm, false otherwise
 */
function compareHashes(password, protectedForm) {
    // Get protectedForm's salt using regex
    const regex = new RegExp(/([0-9]*)(\1)/);
    const salt = protectedForm.match(regex)[1];

    // Develop new hash from salt and supplied password, compare to protectedForm
    const hash = salt + protect(salt, password);
    if (hash === protectedForm) {
        return true;
    }

    return false;
}

/**
 * Hashes the supplied credential using the provided salt
 * @param {string} salt - the salt to be used for hashing
 * @param {string} credential - the credential being hashed
 * 
 * @returns {string} - the hashed, protected version of credential appended to salt
 */
function protect(salt, credential) {
    return salt + crypto.pbkdf2Sync(credential, salt, 10000, 64, 'sha512').toString('hex');
}
