'use strict'
let EventRouter = require('express').Router();
let fs = require('fs');
let authentication = require('../tools/authentication');
let EventDAO = require('../domain/dao/eventDAO');
let token = require('../tools/token');
let banco = require('../db/MongoConnection');

EventRouter.get('/', authentication, (req, res) => {
	EventDAO.findAll(req).then((result) => {
		if (result === null) {
			res.status(404).send({
				message: 'Nenhum evento Encontrado'
			});
		}
		res.status(200).send(result);
	}).catch((err) => {
		res.status(500).json({
			message: 'Erro ao buscar eventos'
		});
	});
});

EventRouter.get('/:eventId', authentication, (req, res) => {
	EventDAO.findById(req.params.eventId).then((result) => {
		if (result === null) {
			res.status(404).send({
				message: 'Nenhum evento Encontrado'
			});
		}
		res.status(200).send(result);
	}).catch((err) => {
		res.status(500).json({
			message: 'Erro ao buscar evento'
		});
	});
});

EventRouter.post('/', authentication, (req, res) => {
	EventDAO.persist(req).then((result) => {
		res.status(201).send({
			eventId: result._doc._id
		});
	}).catch((err) => {
		res.status(500).send({
			error: err
		});
	});
});

EventRouter.put('/update', (req, res) => {
	EventDAO.update(req).then((result) => {
		res.status(200).send({
			message: "Evento Atualizado com sucesso",
		});
	}).catch((err) => {
		res.status(500).json({
			message: "Erro ao atualizar evento"
		});
	});
});

EventRouter.post('/uploadBanner', authentication, (req, res) => {
	EventDAO.uploadBanner(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(500).json({
			message: 'Erro ao salvar banner'
		});
	});
});

EventRouter.post('/banner', authentication, (req, res) => {
	EventDAO.findBanner(req).then((result) => {
		if (result === null) {
			res.status(404).send();
		}
			// banco.Close();
			res.status(200).send(result);
	}).catch((err) => {
		res.status(500).json({
			message: 'Erro ao pegar banner'
		});
	});
});


module.exports = EventRouter;