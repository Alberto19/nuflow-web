'use strict'

const mongoose = require('mongoose');
const config = require('../config');
const Connection = require('./Connection');
class MongoConnection extends Connection {


	GetStringConnection() {
		return config.database; // connect to database
	}

	Connect() {
		mongoose.Promise = global.Promise;
		mongoose.connect(this.GetStringConnection());
		console.info('Conexao aberta');
		return mongoose.connection;
	}

	Close() {
		console.info('Conexao fechada');
		return mongoose.connection.db.close();
	}
}

module.exports = new MongoConnection();