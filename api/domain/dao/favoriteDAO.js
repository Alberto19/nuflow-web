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

   persist(req) {
       const { body } = req;
		var defer = q.defer();
		let saveFavorite = new FavoriteModel({
			companyId: body.companyId,
			eventId: body.eventId,
			userId: req.decoded.id
		});
		saveFavorite
			.save()
			.then((result) => {
				defer.resolve(result);
			})
			.catch(err => {
				defer.reject(err);
			});
		return defer.promise;
	}

    check(req) {
		var defer = q.defer();
		FavoriteModel(req.decoded.id)
            .then((result) => {
              if (result) {
                FavoriteModel
                .update({
                  _id: req.decoded.id
                },
                {
                  $set: {
                    checkIn: req.body.check
                  }
                })
                .then(user => {
                    defer.resolve(user);
                })
                .catch(err => {
				defer.reject(err);
			    });
              }
			});
			
		return defer.promise;
    }
}
module.exports = new FavoriteDAO();