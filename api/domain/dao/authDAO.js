'use strict'
let q = require('q');
var mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let banco = require('../../db/MongoConnection');
let AuthModel = require('../model/authModel');
Grid.mongo = mongoose.mongo;

class authDAO {

	persist(auth) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});

		con.once('open', () => {
			let saveAuth = new AuthModel({
				email: auth.email,
				password: auth.password,
				genre: auth.genre,
				type: auth.type,
				completed: false
			});
			saveAuth
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

	findOne(auth) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});
		con.once('open', () => {
			AuthModel
				.findOne({
					email: auth.email
				})
				.select('email password completed type genre')
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
						let validPass = user.comparePassword(auth.password);
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

	findPhoto(auth) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', () => {
			banco.Close();
		});
		con.once('open', () => {
			let gfs = Grid(con.db);
			AuthModel
				.findOne({
					_id: auth.id
				}).then(user => {
					gfs.files.find({
						filename: user.picture
					}).toArray((err, files) => {

						if (files.length === 0) {
							banco.Close();
							return defer.resolve(null);
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
							let picture = 'data:image/png;jpg;base64,' + Buffer(data).toString('base64');
							banco.Close();
							defer.resolve(picture);
						});

						readstream.on('error', (err) => {
							console.log('An error occurred!', err);
							throw err;
							banco.Close();
							defer.reject({
								status: 500,
								message: "Erro ao pegar foto da base de dados"
							});
						});
					});
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

			AuthModel
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
module.exports = new authDAO();