'use strict'
const mongo = require('mongoose');
const Schema = mongo.Schema;


  let companySchema = new Schema({
    name: {type: String,require: true},
    adress:{type: String, required: true},
    phone:{type: String, required: true},
    rating:{type: Number},
    site:{type: String},
    photos:[],
    reviews:[],
    location: {type: [Number],index:'2d'},
    mapsUrl:{type:String},
    days:[],
    uf:{type: String,require: true}
  });

module.exports = mongo.model('Company',companySchema);
