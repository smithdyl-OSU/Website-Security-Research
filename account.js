module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // Search for user's transactions
    function get_user_transactions(res, mysql, context, sess, complete) {
        sql = "SELECT book_title, date FROM Transactions LEFT JOIN Users ON Transactions.user_id = Users.user_id LEFT JOIN Books ON Transactions.book_id = Books.book_id WHERE Users.user_name = ?";
        mysql.pool.query(sql, [sess.username], function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.transactions = results;
            complete();
        });
    }

    // Load user account page
    router.get('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var callbackCount = 0;
        let sess = req.session;
        let context = {};
        if (sess.email && sess.username) {
            get_user_transactions(res, mysql, context, sess, complete)
            function complete() {
                callbackCount++;
                if (callbackCount >= 1) {
                    context.username = sess.username;
                    res.render('account', context);
                }

            }
        } else {
            res.render('login', context);
        }
    });

    return router;
}();