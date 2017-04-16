'use strict'
const mongo = require('mongoose');
const Schema = mongo.Schema;
const bcrypt = require('bcrypt-nodejs');

 let authSchema = new Schema({
    email:{type: String,unique: true, require: true},
    password:{type: String,require: true},
    genre: {type: String,require: true},
    picture:{type: String},  
    completed: {type: Boolean},
    type: {type: String},
  });

  authSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();

      bcrypt.hash(user.password, null, null, function(err, hash){
      if(err) return next(err);

      user.password = hash;
      next();
    });
  });

  authSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user._doc.password);
  };

module.exports = mongo.model('auth',authSchema);
