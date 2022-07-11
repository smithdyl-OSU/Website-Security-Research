module.exports = function () {
    var express = require('express');
    var router = express.Router();



    function get_users(res, mysql, context, complete) {
        mysql.pool.query("SELECT user_id, user_name, user_role, user_email, user_pw FROM Users", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.users = results;
            complete();
        });
    }


    /*Display all Users. */

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        get_users(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('users', context);
            }

        }
    });


    /* Adds a User */

    router.post('/', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Users (user_id, user_name, user_role, user_email, user_pw) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.user_id, req.body.user_name, req.body.user_role, req.body.user_email, req.body.user_pw];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/users');
            }
        });
    });
    /* tbd Updates a user */

    /* Deletes a User */

    router.get('/delete/:user_id', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Users WHERE user_id = ?";
        var inserts = [req.params.user_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/users');
            }
        });
    });

    return router;
}();
