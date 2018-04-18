var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var routes = require('./controllers/routes.js');

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/api',routes);

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.listen(3000);

module.exports = app;