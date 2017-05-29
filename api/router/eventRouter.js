'use strict'
let EventRouter = require('express').Router();
let fs = require('fs');
let EventDAO = require('../domain/dao/eventDAO');
let token = require('../tools/token');

EventRouter.get('/:eventId', (req, res) => {
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

EventRouter.get('/', (req, res) => {
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

EventRouter.post('/eventParams', (req, res) => {
	EventDAO.findAllBody(req).then((result) => {
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

EventRouter.post('/', (req, res) => {
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

EventRouter.put('/', (req, res) => {
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

EventRouter.post('/uploadBanner', (req, res) => {
	EventDAO.uploadBanner(req).then((result) => {
		res.status(200).send(result);
	}).catch((err) => {
		res.status(500).json({
			message: 'Erro ao salvar banner'
		});
	});
});

EventRouter.post('/banner', (req, res) => {
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