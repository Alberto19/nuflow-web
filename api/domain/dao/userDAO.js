'use strict'
var mongoose = require('mongoose');
let q = require('q');
let Grid = require('gridfs-stream');
let banco = require('../../db/MongoConnection');
let UserModel = require('../model/userModel');
Grid.mongo = mongoose.mongo;

class UserDAO {

	persist(usuario) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});

		con.once('open', () => {
			let saveUser = new UserModel({
				email: usuario.email,
				password: usuario.password,
				genre: usuario.genre,
				type: usuario.type,
				completed: false
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
		con.once('open', () => {
			UserModel
				.findOne({
					email: usuario.email
				})
				.select('email password completed')
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
							message: "Usuário não existe"
						});
					} else if (user) {
						let validPass = user.comparePassword(usuario.password);
						if (!validPass) {
							banco.Close();
							defer.reject({
								status: 401,
								message: "Email ou senha incorretos!!!"
							});
						}
						banco.Close();
						defer.resolve(user);
					}
				});
		});
		return defer.promise;
	}

	find(user) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});
		con.once('open', () => {
			let gfs = Grid(con.db);
			UserModel
				.findOne({
					_id: user.id
				}).then(user => {
					if (user.picture != null) {

						gfs.files.find({
							filename: user.picture
						}).toArray((err, files) => {

							if (files.length === 0) {
								return res.status(400).send({
									message: 'File not found'
								});
							}
							let data = [];
							let readstream = gfs.createReadStream({
								filename: files[0].filename
							});

							readstream.on('data', (chunk) => {
								data.push(chunk);
							});

							readstream.on('end', () => {
								data = Buffer.concat(data);
								let img = 'data:image/png;jpg;base64,' + Buffer(data).toString('base64');
								user.picture = img;
								banco.Close();
								defer.resolve(user);
								// res.end(img);
							});

							readstream.on('error', (err) => {
								console.log('An error occurred!', err);
								throw err;
							});
						});
					} else {
						banco.Close();
						defer.resolve(user);
					}
				});
		});
		return defer.promise;
	}

	updateProfile(req) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});
		con.once('open', () => {
			UserModel
				.update({
					_id: req.decoded.id
				}, {
					$set: {
						name: req.body.name,
						age: req.body.age,
						preference: req.body.preference,
						location: req.body.location,
						completed: true
					}
				})
				.then(user => {
					banco.Close();
					defer.resolve();
				}).catch((err) => {
					banco.Close();
					defer.reject(err);
				});
		});
		return defer.promise;
	}

	uploadPhoto(req) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});
		con.once('open', () => {
			let gfs = Grid(con.db);
			let photo = req.files.file;
			let writeStream = gfs.createWriteStream({
				filename: photo.name,
				mode: 'w',
				content_type: photo.mimetype
			});

			writeStream.write(photo.data);
			writeStream.end();

			UserModel
				.update({
					_id: req.decoded.id
				}, {
					$set: {
						picture: req.files.file.name
					}
				}).then(() => {
					writeStream.on('close', (file) => {
						banco.Close();
						defer.resolve();
					});

				});
		});
		return defer.promise;
	}
}
module.exports = new UserDAO();