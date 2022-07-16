module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //
    function get_results(res, keyword, mysql, context, complete) {
        var sql = "SELECT * FROM Books WHERE book_title LIKE '%" + keyword + "%'";
        mysql.pool.query(sql, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            if (results.length == 0) {
                console.log("empty")
            }
            context.search = results;
            
            complete();
        });
    }

    // Load search results page
    router.get('/', function (req, res) {
        var keyword = req.query.request;
        var callbackCount = 0;
        let context = {};
        var mysql = req.app.get('mysql');
        get_results(res, keyword, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('search', context);
                console.log(context)
            }
        }
    });

    return router;
}();