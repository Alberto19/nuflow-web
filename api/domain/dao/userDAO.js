'use strict'
var mongoose = require('mongoose');
let q = require('q');
let AuthModel = require('../model/authModel');
let UserModel = require('../model/userModel');

class UserDAO {

	find(req) {
		var defer = q.defer();
		var usuario = {};
		AuthModel.findOne({
			email: req.decoded.email
		}).then(auth => {
			usuario.email = auth._doc.email;
			usuario.genre = auth._doc.genre;
			usuario.type = auth._doc.type;
			usuario.completed = auth._doc.completed;
			UserModel
				.findOne({
					_id: req.decoded.id
				}).then(user => {
					if (user != null) {
						usuario.name = user._doc.name;
						usuario.age = user._doc.age;
						usuario.preference = user._doc.preference;
						usuario.favorite = user._doc.favorite;
					}
					defer.resolve(usuario);
				});
		});
		return defer.promise;
	}

	updateProfile(req) {
		var defer = q.defer();
		UserModel.findById(req.decoded.id)
			.then(user => {
				if (user === null) {
					AuthModel.update({
						_id: req.decoded.id
					}, {
						$set: {
							completed: true
						}
					}).then(auth => {
						let saveUser = new UserModel({
							_id: req.decoded.id,
							name: req.body.name,
							age: req.body.age,
							preference: req.body.preference,
							location: req.body.location,
						});
						saveUser
							.save()
							.then(user => {
								defer.resolve();
							}).catch((err) => {
								defer.reject(err);
							});
					});
				} else {
					UserModel.update({
						_id: req.decoded.id
					}, {
						$set: {
							name: req.body.name,
							age: req.body.age,
							preference: req.body.preference,
							location: req.body.location,
						}
					}).then(user => {
						defer.resolve();
					})
				}
			});
		return defer.promise;
	}
}
module.exports = new UserDAO();