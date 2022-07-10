module.exports = function () {
    var express = require('express');
    var router = express.Router();



    function get_books(res, mysql, context, complete) {
        mysql.pool.query("SELECT book_id, book_title, book_qty FROM Books", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.items = results;
            complete();
        });
    }


    /*Display all Books. */

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        get_books(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('books', context);
                console.log(context)
            }

        }
    });


    /* Adds a book */

    router.post('/', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Books (book_id, book_title, book_qty) VALUES (?, ?, ?)";
        var inserts = [req.body.book_id, req.body.book_title, req.body.book_qty];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/books');
            }
        });
    });

    /* tbd Updates a book */



    /* Deletes a Book */

    router.get('/delete/:book_id', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Books WHERE book_id = ?";
        var inserts = [req.params.book_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/books');
            }
        });
    });

    return router;
}();
