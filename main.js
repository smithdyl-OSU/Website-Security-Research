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
app.use(session({ secret: 'secret' }));
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
  // Establish session
  let sess = req.session;
  if (!sess.email || !sess.username) {
    sess.email;
    sess.username;
  }
  res.render('index', context);
});

// Load login page
app.get('/account', function (req, res) {
  let context = {};
  let sess = req.session;
  if (sess.email && sess.username) {
    res.render('admin', context);
  } else {
    res.render('login', context);
  }
});

// Authenticate login
app.post('/auth', function (req, res) {
  // Get username and password from request body
  let sess = req.session;
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    // Query database for a user with both password and username
    mysql.pool.query('SELECT * FROM users WHERE user_name = ? AND user_pw = ?', [username, password], function (error, results, fields) {
      if (error) throw error;
      // User exists, authenticated
      if (results.length > 0) {
        sess.username = results[0].user_name;
        sess.email = results[0].user_email;
        console.log(sess.username, sess.email);
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

// Register user
app.post('/newuser', function (req, res) {
  let username = req.body.createUsername;
  let email = req.body.email;
  let password = req.body.createPassword;
  console.log(typeof (username));
  if (username && email && password) {
    // Submit user to the database
    let values = [username, password, email];
    mysql.pool.query('INSERT INTO mydb.users (user_name, user_pw, user_email) VALUES (?)', [values], function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log("Record inserted")
      res.redirect('/');
    });
  }
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
