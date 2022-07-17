module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var axios = require('axios');


    // get all books from DB
    function get_books(res, mysql, context, complete) {
        mysql.pool.query("SELECT book_id, book_title, book_qty FROM Books", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.books = results;
            complete();
        });
    }

    // get a single book from DB
    function get_book(res, mysql, context, id, complete) {
        var sql = "SELECT book_id, book_title, book_qty FROM Books WHERE book_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {

            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.book = results[0];
            complete();
        });
    }

    // axios example call to backend

    const get_book_test = async (id) => {
        const resp = await axios.get('http://localhost:3000/books/' + id)
        console.log(resp.data);
        return(resp.data);
       };

    /*Display all Books. */

    router.get('/test',  async function(req, res) {
        const book = await get_book_test(11)
        console.log(book);
        res.send(book);
    });

    
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        get_books(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                context.add = true;
                context.modify = true;
                res.render('books', context);
                // console.log(context)
            }
        }
    });

    /*Display add book form only*/
    router.get('/add', function (req, res) {
        var context = {};
        context.add = true;
        res.render('books', context);
    });

    /*Display books list only*/
    router.get('/remove', function (req, res) {
        var context = {};
        context.modify = true;
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        get_books(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('books', context);
            }
        }
    });

    router.get('/:id', function (req, res) {
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        get_book(res, mysql, context, req.params.id, complete);
        // getStore(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.status(200).send(context);
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
