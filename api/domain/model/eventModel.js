'use strict'
const mongoose = require('mongoose');
const  Schema = mongoose.Schema;


  let eventSchema = new Schema({
    name: {type: String, require: true},
    type: [{type: String, require: true}],
    dateEvent:{type: String, require: true},
    price:{type:Number, require: true},
    description:{type: String, require: true },
    artists:[{type: String}],
    banner:{type: String},
    checkIn:[],
    favorite:[],
    companyId: {type: String, require: true}
  });

module.exports = mongoose.model('Event',eventSchema);

