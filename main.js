/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var session = require('express-session');
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
app.use(session({ secret: 'secret' }));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use(express.static('static'));
app.use('/transactions', require('./transactions.js'));
app.use('/users', require('./users.js'));
app.use('/books', require('./books.js'));
app.use('/search', require('./search.js'));
app.use('/login', require('./login.js'));
app.use('/logout', require('./login.js'));
app.use('/register', require('./register.js'));
app.use('/account', require('./account.js'));

app.use('/', express.static('public'));

// Load the Home page
app.get('/', function (req, res) {
  let context = {};
  // Establish session
  let sess = req.session;
  if (!sess.email || !sess.username) {
    sess.email;
    sess.username;
  }
  res.render('index', context);
});

// Load login page
app.get('/login', function (req, res) {
  let context = {};
  let sess = req.session;
  if (sess.email && sess.username) {
    res.redirect('account');
  } else {
    res.render('login', context);
  }
});

// Logout user
app.get('/logout', function (req, res) {
  // Discard user's session
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

// Load registration page
app.get('/register', function (req, res) {
  let context = {};
  res.render('register', context);
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