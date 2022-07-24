module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // Search for user with provided credentials
    function get_user(res, username, password, mysql, context, complete) {
        mysql.pool.query('SELECT * FROM users WHERE user_name = ? AND user_pw = ?', [username, password], function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.search = results;
            complete();
        });
    }

    // Load user information
    router.post('/', function (req, res) {
        // Get username and password from request body
        let sess = req.session;
        let username = req.body.username;
        let password = req.body.password;
        if (!username && !password) {
            // User did not provide both username and password
            res.send('Please enter Username and Password!');
            res.end();
        }
        var callbackCount = 0;
        var context = {};
        // Query database for a user with both password and username
        var mysql = req.app.get('mysql');
        get_user(res, username, password, mysql, context, complete);
        function complete() {
            callbackCount++;
            result = context.search[0];
            console.log(result);
            if (callbackCount >= 1) {
                if (result) {
                    // User exists, authenticated
                    sess.username = result.user_name;
                    sess.email = result.user_email;
                    sess.role = result.user_role;
                    console.log(sess.username, sess.email);
                    console.log('success');
                    res.redirect('/')
                } else {
                    // User does not exist
                    console.log('failure')
                    res.send('Incorrect username and/or password!');
                } res.end();
            }
        }
    });

    return router;
}();