const { hasUncaughtExceptionCaptureCallback } = require('process');

module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var axios = require('axios');
    var multer = require('multer');
    var fs = require('fs');
    var xml2js = require('xml2js')
    var parser = new xml2js.Parser({ attrkey: "ATTR" });

    // Defines upload location for xml files submitted by administrator
    var upload = multer({ dest: 'uploads' });
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    var upload = multer({ storage: storage });


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
        return (resp.data);
    };

    /*Display all Books. */

    router.get('/test', async function (req, res) {
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

    /*Route for adding multiple books through xml file upload*/
    router.post('/upload', upload.single('xml_file'), function (req, res) {
        try {
            // Locate file upload location
            var path = '.\\' + req.file.path;
            console.log(path);
            // Open file for reading
            let xml = fs.readFileSync(path, "utf8");

            // Parse xml file
            parser.parseString(xml, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    const books = result.Books.Book;
                    var mysql = req.app.get('mysql');
                    for (const book of books) {
                        console.log(book);
                        var sql = "INSERT INTO Books (book_id, book_title, book_qty) VALUES (?, ?, ?)";
                        var inserts = [parseInt(book.Id[0]), book.Title[0], parseInt(book.Quantity[0])];
                        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                            if (error) {
                                console.log(JSON.stringify(error))
                                res.write(JSON.stringify(error));
                                res.end();
                            }
                        });
                    }
                    // console.log(result.Books.Book);
                }
            })
        } catch (err) {
            res.send(400);
        }
        res.redirect('/books');
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
