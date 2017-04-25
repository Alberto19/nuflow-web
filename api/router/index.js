"use strict"

let app = require('express')();
let authentication = require('../tools/authentication');

let userRouter = require('./userRouter');
let searchRouter = require('./searchRouter');
let companyRouter = require('./companyRouter');
let authRouter = require('./authRouter');
let eventRouter = require('./eventRouter');
let navigationRouter = require('./navigationRouter');

app.use('/auth',authRouter);
app.use('/user', userRouter);
app.use('/search',searchRouter);
app.use('/company',companyRouter);
app.use('/event', authentication, eventRouter);
app.use('/navigation', authentication, navigationRouter);

module.exports = app;

