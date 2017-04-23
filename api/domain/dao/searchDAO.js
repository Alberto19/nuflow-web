'use strict'
let banco = require('../../db/MongoConnection');
let q = require('q');
let CompanyModel = require('../model/companyModel');


class SearchDAO {

	findAll(location, radius, keyword) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', ()=>{
			banco.Close();
		});
		con.once('open', ()=> {
			// CompanyModel.find({name:/^C/, location:{$near:[-23.5167093,-46.5093445],$maxDistance:1}})
			CompanyModel.find({name:{ $regex : `^${keyword}` }, location:{$near:location,$maxDistance:radius}})
				.then((result) => {
					banco.Close();
					defer.resolve(result);
				})
				.catch(err => {
					defer.reject(err);
					console.log('Erro: ', err);
				});
		});
		return defer.promise;
	}
}

module.exports = new SearchDAO();