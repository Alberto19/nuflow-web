'use strict'
let q = require('q');
let CompanyModel = require('../model/companyModel');

class SearchDAO {

	findAll(location, radius, keyword) {
		var defer = q.defer();

		// CompanyModel.find({name:/^C/, location:{$near:[-23.5167093,-46.5093445],$maxDistance:1}})
		CompanyModel.find({
				name: {
					$regex: `^${keyword}`
				},
				location: {
					$near: location,
					$maxDistance: radius
				}
			})
			.then((result) => {
				defer.resolve(result);
			})
			.catch(err => {
				defer.reject(err);
				console.log('Erro: ', err);
			});
		return defer.promise;
	}

	findById(id) {
        var defer = q.defer();
        CompanyModel.findById({
            _id: id
        }).then(company => {
            defer.resolve(company);
        }).catch(error => {
            defer.reject(error);
        })
        return defer.promise;
    };
}

module.exports = new SearchDAO();