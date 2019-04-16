
require('./config/config');
require('./model/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const rtsIndex = require('./routes/index.router');
const catIndex = require('./routes/categories.router');
const testIndex = require('./routes/test.router');

var app = express();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

/**CORS */
app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
);
if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
}
next();
});

/**Initializing Routes */
app.use('/rest/api', rtsIndex);
app.use('/rest/test', testIndex)
app.use('/rest/category', catIndex);

/**Global Error Handler */
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

module.exports = app;