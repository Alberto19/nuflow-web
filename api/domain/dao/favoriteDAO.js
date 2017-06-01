'use strict'
var mongoose = require('mongoose');
let q = require('q');
let EventModel = require('../model/eventModel');
let FavoriteModel = require('../model/favoriteModel');

class FavoriteDAO {

	findUser(req) {
		var defer = q.defer();
		const favorite = {};
		FavoriteModel.find({
			userId: req.decoded.id
		}).then(result => {
			return favorite = result._doc.eventId;
		})
			.then((id) => {
				return EventModel
					.findById({
						_id: id
					})
			}).then(events => {
				defer.resolve(events);
			}).catch(error => {
				defer.reject(error);
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
		FavoriteModel.find({
			userId: req.decoded.id
		})
			.then((result) => {
				if (result.length) {
					if (body.check && body.favorite) {
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
					else if (body.check && !body.favorite) {
						FavoriteModel
							.update({
								userId: req.decoded.id
							},
							{
								$set: {
									checkIn: body.check
								}
							}).then((result) => defer.resolve(result));
					}
					else if (body.favorite && !body.check) {
						FavoriteModel
							.update({
								userId: req.decoded.id
							},
							{
								$set: {
									favorite: body.favorite
								}
							}).then((result) => defer.resolve(result));
					}

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