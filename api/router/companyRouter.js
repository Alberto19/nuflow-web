'use strict'
let CompanyRouter = require('express').Router();
let CompanyDAO = require('../domain/dao/companyDAO');
let authentication = require('../tools/authentication');
let token = require('../tools/token');

CompanyRouter.post('/cadastrar', (req, res) => {
	CompanyDAO.persist(req.body).then((result) => {
		token.createToken(result._doc).then((token) => {
			res.status(201).send({
				token: token,
				message: 'success'
			});
		});
	}).catch((err) => {
		res.status(500).json("Erro interno");
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