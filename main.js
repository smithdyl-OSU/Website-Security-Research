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

document.cookie = null;

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

// Authenticate login
app.post('/auth', function (req, res) {
  // Get username and password from request body
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    // Query database for a user with both password and username
    mysql.pool.query('SELECT * FROM users WHERE user_name = ? AND user_pw = ?', [username, password], function (error, results, fields) {
      if (error) throw error;
      // User exists, authenticated
      if (results.length > 0) {
        // req.session.loggedin = true;
        // req.session.username = username;
        console.log('success');
        res.redirect('/');
      } else {
        // User does not exist
        console.log('failure');
        res.send('Incorrect username and/or Password!');
      } res.end();
    });
  } else {
    // User did not provide both username and password
    res.send('Please enter Username and Password!');
    res.end();
  }
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
