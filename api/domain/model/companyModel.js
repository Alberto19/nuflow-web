'use strict'
const mongo = require('mongoose');
const Schema = mongo.Schema;
const bcrypt = require('bcrypt-nodejs');


  let companySchema = new Schema({
    name: {type: String,require: true},
    email:{type: String, unique: true, require: true},
    password:{type: String, require: true},
    adress:{type: String, required: true},
    phone:{type: String, required: true},
    rating:{type: Number},
    site:{type: String},
    photos:[{type: String}],
    reviews:[],
    location: {type: [Number],index:'2d'},
    mapsUrl:{type:String},
    days:[{type: String}],
    uf:{type: String, require: true},
    county:{type: String, require: true},
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
