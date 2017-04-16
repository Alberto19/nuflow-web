'use strict'
let banco = require('../../db/MongoConnection');
let q = require('q');
let CompanyModel = require('../model/companyModel');


class CompanyDAO {

	persistAll(company) {
		var defer = q.defer();
		let con = banco.Connect();
		con.on('error', console.error.bind(console, 'connection error:'));
		con.once('open', function callback() {
			for (var i = 0; i < company.length; i++) {
				let saveCompany = new CompanyModel({
					name: company[i].name,
					adress: company[i].adress,
					phone: company[i].phone,
					rating: company[i].rating,
					site: company[i].site,
					photos: company[i].photos,
					reviews: company[i].reviews,
					location: company[i].location,
					mapsUrl: company[i].mapsUrl,
					days: company[i].days,
					uf: company[i].uf
				});
				saveCompany.save().then(() => {
					if (i == company.length) {
						banco.Close();
					}
				});
			}
			defer.resolve();
		});
		return defer.promise;
	}

}

module.exports = new CompanyDAO();