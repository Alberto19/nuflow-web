'use strict'
let UserRouter = require('express').Router();
let fs = require('fs');
let authentication = require('../tools/authentication');
let UserDAO = require('../domain/dao/userDAO');
let token = require('../tools/token');


UserRouter.get('/profile', authentication, (req, res) => {
	UserDAO.find(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

UserRouter.post('/updateProfile', authentication, (req, res) => {
	UserDAO.updateProfile(req).then(() => {
		res.status(200).send();
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

module.exports = UserRouter;