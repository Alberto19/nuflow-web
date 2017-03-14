'use strict'
let SearchRouter = require('express').Router();
let token = require('../tools/token');
let authentication = require('../tools/authentication');
let searchDAO = require('../domain/dao/searchDAO');

SearchRouter.post('/places', (req, res) => {
	let location = req.body.location;
	let radius = req.body.radius;
	let keyword = req.body.keyword;

	searchDAO.findAll(location, radius, keyword)
		.then((result) => {
			res.status(201).send(result);

		})
});

module.exports = SearchRouter;

