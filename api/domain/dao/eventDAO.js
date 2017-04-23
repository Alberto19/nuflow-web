'use strict'
let q = require('q');
var mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let banco = require('../../db/MongoConnection');
let EventModel = require('../model/eventModel');
Grid.mongo = mongoose.mongo;
var con = null;

class EventDAO {

    findAll(req) {
        var defer = q.defer();
        let con = banco.Connect();
        con.on('error', () => {
            banco.Close();
        });
        con.once('open', () => {
            var event = {};
            EventModel.find({
                companyId: req.decoded.id
            }).then(events => {
                banco.Close();
                defer.resolve(events);
            }).catch(error => {
                banco.Close();
                defer.reject(error);
            })
        });
        return defer.promise;
    };

    findById(id) {
        var defer = q.defer();
        let con = banco.Connect();
        con.on('error', () => {
            banco.Close();
        });
        con.once('open', () => {
            var event = {};
            EventModel.findById({
                _id: id
            }).then(events => {
                banco.Close();
                defer.resolve(events);
            }).catch(error => {
                banco.Close();
                defer.reject(error);
            })
        });
        return defer.promise;
    };

    persist(req) {
        var defer = q.defer();
        let con = banco.Connect();
        con.on('error', () => {
            banco.Close();
        });

        con.once('open', () => {
            let saveEvent = new EventModel({
                name: req.body.name,
                type: req.body.type,
                dateEvent: req.body.dataEvent,
                price: req.body.price,
                description: req.body.description,
                artists: req.body.artists,
                companyId: req.decoded.id
            });
            saveEvent
                .save()
                .then((result) => {
                    banco.Close();
                    defer.resolve(result);
                })
                .catch(err => {
                    banco.Close();
                    defer.reject(err);
                });
        });
        return defer.promise;
    };

    update(req) {
        var defer = q.defer();
        let con = banco.Connect();
        con.on('error', () => {
            banco.Close();
        });
        con.once('open', () => {
            EventModel.update({
                companyId: req.decoded.id
            }, {
                $set: {
                    name: req.body.name,
                    type: req.body.type,
                    dateEvent: req.body.dataEvent,
                    price: req.body.price,
                    description: req.body.description,
                    artists: req.body.artists,
                    banner: req.body.banner,
                    checkIn: req.body.checkIn,
                }
            }).then(event => {
                banco.Close();
                defer.resolve();
            }).catch((err) => {
                banco.Close();
                defer.reject(err);
            });

        });
        return defer.promise;
    };

    findBanner(req) {
        var defer = q.defer();
        if (con === null) {
            con = banco.Connect();
        }
        con.on('error', () => {
            banco.Close();
        });
        con.once('open', () => {
            let gfs = Grid(con.db);
            EventModel
                .findOne({
                    _id: req.body.id
                }).then(event => {
                    gfs.files.find({
                        filename: event.banner
                    }).toArray((err, files) => {
                        let data = [];
                        let readstream = gfs.createReadStream({
                            filename: files[0].filename
                        });

                        readstream.on('data', (chunk) => {
                            data.push(chunk);
                        });

                        readstream.on('end', () => {
                            data = Buffer.concat(data);
                            let banner = 'data:image/png;jpg;base64,' + Buffer(data).toString('base64');
                            banco.Close();
                            defer.resolve(banner);
                        });

                        readstream.on('error', (err) => {
                            console.log('An error occurred!', err);
                            throw err;
                            banco.Close();
                            defer.reject({
                                status: 500,
                                message: "Erro ao pegar banner da base de dados"
                            });
                        });
                    });
                });
        });
        return defer.promise;
    }

    uploadBanner(req) {
        var defer = q.defer();
        let con = banco.Connect();
        con.on('error', () => {
            banco.Close();
        });
        con.once('open', () => {
            let gfs = Grid(con.db);
            let banner = req.files.file;
            let writeStream = gfs.createWriteStream({
                filename: banner.name,
                mode: 'w',
                content_type: banner.mimetype
            });

            writeStream.write(banner.data);
            writeStream.end();

            EventModel
                .update({
                    _id: req.body.id
                }, {
                    $set: {
                        banner: req.files.file.name
                    }
                }).then(() => {
                    writeStream.on('close', (file) => {
                        banco.Close();
                        defer.resolve();
                    });

                });
        });
        return defer.promise;
    }
}

module.exports = new EventDAO();