'use strict'
let banco = require('../../db/MongoConnection');
let q = require('q');
let UserModel = require('../model/userModel');
var mongoose = require('mongoose');


class UserDAO {

	persist(usuario) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});

		con.once('open', ()=> {
			let saveUser = new UserModel({
				email: usuario.email,
				password: usuario.password,
				genre: usuario.genre
			});
			saveUser
				.save()
				.then((result) => {
					banco.Close();
					defer.resolve(result);
				})
				.catch(err => {
					banco.Close();
					defer.reject(err);
					console.log('Erro: ', err);
				});
		});
		return defer.promise;
	}

	findOne(usuario) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});
		con.once('open', ()=>{
			UserModel
				.findOne({
					email: usuario.email
				})
				.select('email password')
				.exec((err, user) => {
					if (err) {
						banco.Close();
						defer.reject({
							status: 500,
							message: "Erro ao procurar usuario"
						});
					} else if (!user) {
						banco.Close();
						defer.reject({
							status: 404,
							message: "User doesn't exist"
						});
					} else if (user) {
						let validPass = user.comparePassword(usuario.password);
						if (!validPass) {
							banco.Close();
							defer.reject({
								status: 401,
								message: "Invalid Password"
							});
						} 
						defer.resolve(user);
					}
					banco.Close();
				});
		});
		return defer.promise;
	}
}
module.exports = new UserDAO();