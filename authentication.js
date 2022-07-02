function validateEmail(email) {
    /**
     * Checks if the string passed is a valid email.
     * @param {string} email
     * @return {bool} - true if valid email, false otherwise
     */

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

function validatePassword(password, confirm) {
    /**
     * Checks if the supplied password is confirmed and meets the security requirements.
     * @param {string} password - User's requested password
     * @param {string} confirm - The user's password confirmation; should === password
     */
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
