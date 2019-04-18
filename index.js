const env = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/', routes);
app.use(function (err, req, res, next) {
    res.status(422).send({
        err: err.message
    })
});
app.listen(process.env.port || port, function() {
    console.log('Express server started on port ' + port);
});