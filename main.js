/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

PORT = 2650

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use(express.static('static'));
app.use('/transactions', require('./transactions.js'));
app.use('/users', require('./users.js'));
app.use('/books', require('./books.js'));

app.use('/', express.static('public'));

// Load the Home page
app.get('/', function (req, res) {
  let context = {};
  res.render('index', context);
});

// Load login page
app.get('/login', function (req, res) {
  let context = {};
  res.render('login', context);
  });

// Load registration page
app.get('/register', function (req, res) {
  let context = {};
  res.render('register', context);
  });

// Load search results page
app.get('/search', function (req, res) {
  let context = {};
  res.render('search', context);
  });

// Load user profile page
app.get('/user_portal', function (req, res) {
  let context = {};
  res.render('user_portal', context);
  });

// Load admin profile page
app.get('/admin', function (req, res) {
  let context = {};
  res.render('admin', context);
  });

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
