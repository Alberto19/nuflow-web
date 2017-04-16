'use strict'
let AuthRouter = require('express').Router();
let fs = require('fs');
let authentication = require('../tools/authentication');
let AuthDAO = require('../domain/dao/authDAO');
let token = require('../tools/token');


AuthRouter.post('/cadastrar', (req, res) => {
	AuthDAO.persist(req.body).then((result) => {
		token.createToken(result._doc).then((token) => {
			res.status(201).send({
				token: token,
				message: 'success'
			});
		});
	}).catch((err) => {
		res.status(500).json("Usuario já cadastrado");
	});
});

AuthRouter.post('/login', (req, res) => {
	AuthDAO.findOne(req.body).then((result) => {
		token.createToken(result._doc).then((token) => {
			res.status(200).send({
				token: token,
				auth: result._doc
			});

		});
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

AuthRouter.post('/uploadPhoto', authentication, (req, res) => {
	AuthDAO.uploadPhoto(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

AuthRouter.get('/photo', authentication, (req, res) => {
	AuthDAO.findPhoto(req.decoded).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});


module.exports = AuthRouter;