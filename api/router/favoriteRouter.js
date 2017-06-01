'use strict'
let FavoriteRouter = require('express').Router();
let fs = require('fs');
let FavoriteDAO = require('../domain/dao/favoriteDAO');

FavoriteRouter.get('/user', (req, res) => {
	FavoriteDAO.findUser(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

FavoriteRouter.get('/company', (req, res) => {
	FavoriteDAO.findCompany(req).then(() => {
		res.status(200).send();
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

FavoriteRouter.post('/persiste', (req, res) => {
	FavoriteDAO.favorite(req).then(() => {
		res.status(200).send();
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

FavoriteRouter.post('/check', (req, res) => {
	FavoriteDAO.check(req).then(() => {
		res.status(200).send();
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

module.exports = FavoriteRouter;