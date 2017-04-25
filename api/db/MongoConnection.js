"use strict";
let mongoose = require('mongoose');

module.exports = (config) => {
    var dbURI = config.database;
    
	mongoose.Promise = global.Promise;
    mongoose.connect(dbURI);
    // CONNECTION EVENTS
    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected to ' + dbURI);
    });
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose connection error: ' + err);
    });
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected');
    });
};


// 'use strict'

// const mongoose = require('mongoose');
// const config = require('../config');
// const Connection = require('./Connection');
// class MongoConnection extends Connection {


// 	GetStringConnection() {
// 		return config.database; // connect to database
// 	}

// 	Connect() {
// 		mongoose.Promise = global.Promise;
// 		mongoose.connect(this.GetStringConnection());
// 		console.info('Conexao aberta');
// 		return mongoose.connection;
// 	}

// 	Close() {
// 		console.info('Conexao fechada');
// 		return mongoose.connection.db.close();
// 	}
// }

// module.exports = new MongoConnection();