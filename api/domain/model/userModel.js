'use strict'
const mongo = require('mongoose');
const Schema = mongo.Schema;
const bcrypt = require('bcrypt-nodejs');

 let userSchema = new Schema({
    name: {type: String},
    age: {type:Number},
    facebook:{type: String},    
    location: {type: [Number],index:'2d'},
    dateCreate:{type: Date, default: Date.now},
    dateLastLogin: Date,
    preference:[{type: String}],
    favorite:[{
            name: String,
            location: {type: [Number],index:'2d'} 
          }],

  });

  userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();

      bcrypt.hash(user.password, null, null, function(err, hash){
      if(err) return next(err);

      user.password = hash;
      next();
    });
  });

  userSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user._doc.password);
  };

module.exports = mongo.model('User',userSchema);
