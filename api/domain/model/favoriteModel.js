'use strict'
const mongo = require('mongoose');
const Schema = mongo.Schema;

 let favoriteSchema = new Schema({
    companyId: {type: String},
    eventId: {type:String},
    userId:{type: String},
    checkIn: {type: Boolean},
    favorite: {type: Boolean}
  });

module.exports = mongo.model('Favorite',favoriteSchema);
