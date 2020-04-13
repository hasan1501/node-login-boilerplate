const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();

// Add all the domains that you would like to whitelist
var whitelist = ['https://google.com']

app.use(cors({origin: whitelist, credentials: true}))

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(bodyParser.json());

// Plug routers here
app.use(require('./routes'));

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});

module.exports = app;