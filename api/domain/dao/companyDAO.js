'use strict'
let q = require('q');
let CompanyModel = require('../model/companyModel');
let UserModel = require('../model/userModel');
let AuthModel = require('../model/authModel');

class CompanyDAO {

	find(req) {
		var defer = q.defer();
		var company = {};
		AuthModel.findOne({
			email: req.decoded.email
		}).then(auth => {
			company.email = auth._doc.email;
			company.type = auth._doc.type;
			company.completed = auth._doc.completed;
			CompanyModel
				.findOne({
					_id: req.decoded.id
				}).then(user => {
					if (user != null) {
						company.name = user._doc.name;
						company.adress = user._doc.adress;
						company.phone = user._doc.phone;
						company.rating = user._doc.rating;
						company.site = user._doc.site;
						company.reviews = user._doc.reviews;
						company.mapsUrl = user._doc.mapsUrl;
						company.days = user._doc.days;
						company.uf = user._doc.uf;
						company.country = user._doc.country;
						company.drinkPrice = user._doc.drinkPrice;
						company.description = user._doc.description
					}
					defer.resolve(company);
				});
		})
		return defer.promise;
	}

	comments(req) {
		var defer = q.defer();
		UserModel.findById({
			_id: req.decoded.id
		}).then(user => {
			let name = user._doc.name;
			CompanyModel.update({
				_id: req.body.id
			}, {
				$push: {
					reviews: {
						author_name: name,
						message: req.body.comment,
						rating: req.body.rating
					}
				}
			}).then(company => {
				defer.resolve();
			});
		});
		return defer.promise;
	}

	updateProfile(req) {
		var defer = q.defer();
		CompanyModel.findById(req.decoded.id)
			.then(company => {
				if (company === null) {
					AuthModel.update({
						_id: req.decoded.id
					}, {
						$set: {
							completed: true
						}
					}).then(auth => {

						let saveCompany = new CompanyModel({
							_id: req.decoded.id,
							name: req.body.name,
							adress: req.body.adress,
							phone: req.body.phone,
							location: req.body.location,
							rating: 1,
							site: req.body.site,
							days: req.body.days,
							mapsUrl: req.body.mapsUrl,
							uf: req.body.uf,
							country: req.body.country,
							drinkPrice: req.body.drinkPrice,
							description: req.body.description
						});

						saveCompany
							.save()
							.then(user => {
								defer.resolve();
							}).catch((err) => {
								defer.reject(err);
							});
					});
				} else {
					CompanyModel.update({
						_id: req.decoded.id
					}, {
						$set: {
							name: req.body.name,
							adress: req.body.adress,
							phone: req.body.phone,
							location: req.body.location,
							site: req.body.site,
							reviews: req.body.reviews,
							days: req.body.days,
							mapsUrl: req.body.mapsUrl,
							uf: req.body.uf,
							country: req.body.country,
							drinkPrice: req.body.drinkPrice,
							description: req.body.description
						}
					}).then(company => {
						defer.resolve();
					})
				}
			});
		return defer.promise;
	}

}

module.exports = new CompanyDAO();