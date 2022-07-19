module.exports = function () {
    var express = require('express');
    var router = express.Router();

    router.post('/', function (req, res) {
        // Extract user's requested user information
        let username = req.body.create_username;
        let email = req.body.email;
        let password = req.body.create_password;
        if (username && email && password) {
            //submit user to the database
            let values = [username, password, email];
            var mysql = req.app.get('mysql');
            mysql.pool.query('INSERT INTO mydb.users (user_name, user_pw, user_email) VALUES (?)', [values], function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                console.log("Record inserted");
                res.redirect('/login');
            })
        } else {
            res.send('You must submit a username and email, and set a password');
        }
    });

    return router;
}();