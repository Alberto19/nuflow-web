'use strict'
let UserRouter = require('express').Router();
let formidable = require('formidable');
let authentication = require('../tools/authentication');
let UserDAO = require('../domain/dao/userDAO');
let token = require('../tools/token');


UserRouter.post('/cadastrar',(req, res)=>{
	UserDAO.persist(req.body).then((result)=>{
		token.createToken(result._doc).then((token)=>{
			res.status(201).send({
				token: token,
				message: 'success'
			});

		});
	}).catch((err)=>{
		res.status(500).json("Usuario já cadastrado");
	});
});

UserRouter.post('/login', (req, res)=>{
	UserDAO.findOne(req.body).then((result)=>{
		token.createToken(result._doc).then((token)=>{
			res.status(201).send({
				token: token,
				completed: result._doc.completed
			});

		});
	}).catch((err)=>{
		res.status(err.status).json(err.message);
	});
});

UserRouter.get('/profile',authentication,(req, res)=>{
	UserDAO.find(req.decoded).then((result)=>{
			res.status(200).send(result);
	}).catch((err)=>{
		res.status(err.status).json(err.message);
	});
});

module.exports = UserRouter;
