'use strict'
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let cors = require('cors');
var path = require('path');
let mongoose = require('mongoose');
let morgan = require('morgan');
let routes = require('./api/router');

let http = require('http').Server(app);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use(methodOverride('Access-Control-Allow-Origin', '*'));
app.use(methodOverride('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'));
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

//Api
app.use('/api',routes);

// Serve static files
app.use(express.static(__dirname+ '/public'));

// Otherwise return index page
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname +'/public/views/index.html'));
});

http.listen('3000', function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});

module.exports = app;