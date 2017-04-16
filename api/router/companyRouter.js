'use strict'
let CompanyRouter = require('express').Router();
let CompanyDAO = require('../domain/dao/companyDAO');
let authentication = require('../tools/authentication');
let token = require('../tools/token');


CompanyRouter.get('/ProfileCompany', authentication, (req, res) => {
	CompanyDAO.find(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(err.status).json(err.message);
	});
});

CompanyRouter.post('/updateProfileCompany', authentication, (req, res) => {
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


module.exports = CompanyRouter;