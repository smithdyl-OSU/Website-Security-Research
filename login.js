const mysql = require('mysql');
const express = require('express');
//const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost:3000',
    user: 'root',
    password: 'password',
    database: 'mydb'
});

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (request, response) {
    console.log('here');
    response.sendFile(path.join(__dirname + '/login.handlebars'));
});

