'use strict'
var mongoose = require('mongoose');
let q = require('q');
let EventModel = require('../model/eventModel');
let FavoriteModel = require('../model/favoriteModel');

class FavoriteDAO {

	findUser(req) {
		var defer = q.defer();
		let eventos = [];
		FavoriteModel.find({ userId: req.decoded.id })
		.then(result => {
		result.map(event => {
			EventModel
			.findById({
				_id: event._doc.eventId
			}).then(event => {
				return eventos.push(event);
			}).then(() => {
				defer.resolve(eventos);		
			})
		})
	})
		return defer.promise;
}

	findCompany(req) {
		var defer = q.defer();
		FavoriteModel.find({
			companyId: req.decoded.id
		}).then(favorite => {
			defer.resolve(favorite._doc);
		});
		return defer.promise;
	}

	findPlace(req) {
		var defer = q.defer();
		FavoriteModel.find({
			userId: req.decoded.id
		}).then(favorite => {
			defer.resolve(favorite);
		});
		return defer.promise;
	}

	persist(req) {
		const { body } = req;
		var defer = q.defer();
		FavoriteModel.find({ userId: req.decoded.id })
		.then((result) => {
			console.log(result);
			if (result[0].eventId === body.eventId) {
				FavoriteModel
					.update({
						userId: req.decoded.id
					},
					{
						$set: {
							checkIn: body.check,
							favorite: body.favorite,
						}
					}).then((result) => defer.resolve(result));
			}
			else {
				let saveFavorite = new FavoriteModel({
					companyId: body.companyId,
					eventId: body.eventId,
					favorite: body.favorite,
					checkIn: body.check,
					userId: req.decoded.id,
				});
				saveFavorite
					.save()
					.then((result) => {
						defer.resolve(result);
					})
					.catch((err) => {
						defer.reject(err);
					});
			}
			});
		return defer.promise;
	}
}

module.exports = new FavoriteDAO();