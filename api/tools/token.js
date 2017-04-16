'use strict'

let jsonwebtoken = require('jsonwebtoken');
let secretKey = require('../config').secretKey;
let q = require('q');

module.exports = new class Token {

	createToken(auth) {
		var defer = q.defer();
			let token = jsonwebtoken.sign({
				id: auth._id,
				email: auth.email,
				type: auth.type
			}, secretKey);
			defer.resolve(token);
		return defer.promise;
	}
}