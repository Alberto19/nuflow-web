"use strict"

let app = require('express')();
let authentication = require('../tools/authentication');

let userRouter = require('./userRouter');
let searchRouter = require('./searchRouter');
let companyRouter = require('./companyRouter');
let authRouter = require('./authRouter');
let eventRouter = require('./eventRouter');

app.use('/auth',authRouter);
app.use('/user', userRouter);
app.use('/search',searchRouter);
app.use('/company',companyRouter);
app.use('/event', eventRouter);

module.exports = app;

