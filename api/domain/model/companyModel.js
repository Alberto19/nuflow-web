'use strict'
const mongo = require('mongoose');
const Schema = mongo.Schema;
const bcrypt = require('bcrypt-nodejs');


  let companySchema = new Schema({
    name: {type: String},
    adress:{type: String},
    phone:{type: String},
    rating:{type: Number},
    site:{type: String},
    photos:[{type: String}],
    reviews:[],
    location: {type: [Number],index:'2d'},
    mapsUrl:{type:String},
    days:[{type: String}],
    uf:{type: String},
    country:{type: String},
    drinkPrice:{type: String},
    completed: {type: Boolean},
    type: {type: String},
  });

  companySchema.pre('save', function(next){
    var company = this;
    if(!company.isModified('password')) return next();

      bcrypt.hash(company.password, null, null, function(err, hash){
      if(err) return next(err);

      company.password = hash;
      next();
    });
  });

  companySchema.methods.comparePassword = function(password){
    var company = this;
    return bcrypt.compareSync(password, company._doc.password);
  };


module.exports = mongo.model('Company',companySchema);
