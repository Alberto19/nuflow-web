'use strict'
let CompanyRouter = require('express').Router();
let CompanyDAO = require('../domain/dao/companyDAO');
let token = require('../tools/token');

CompanyRouter.get('/ProfileCompany', (req, res) => {
	CompanyDAO.find(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

CompanyRouter.post('/updateProfileCompany', (req, res) => {
	CompanyDAO.updateProfile(req).then(() => {
		res.status(200).send();
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

CompanyRouter.post('/createAll', (req, res) => {
	CompanyDAO.persistAll(req.body).then((result) => {
		res.status(201).send({
			message: 'success'
		});
	}).catch((err) => {
		res.status(500).json("Erro interno");
	});
});

CompanyRouter.post('/comments', (req, res) => {
	CompanyDAO.comments(req).then((result) => {
		res.status(200).send();
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

module.exports = CompanyRouter;