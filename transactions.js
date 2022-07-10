module.exports = function () {
    var express = require('express');
    var router = express.Router();



    function get_transactions(res, mysql, context, complete) {
        mysql.pool.query("SELECT t_id, book_id, user_id, date FROM Transactions", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.transactions = results;
            complete();
        });
    }


    /*Display all Transactions. */

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        get_transactions(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('transactions', context);
            }

        }
    });


    /* Adds a Transaction */

    router.post('/', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Transactions (t_id, book_id, user_id, date) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.t_id, req.body.book_id, req.body.user_id, req.body.date];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/transactions');
            }
        });
    });

    /* tbd Updates a transaction */



    /* Deletes a Transaction */

    router.get('/delete/:t_id', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Transactions WHERE t_id = ?";
        var inserts = [req.params.t_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/transactions');
            }
        });
    });

    return router;
}();


