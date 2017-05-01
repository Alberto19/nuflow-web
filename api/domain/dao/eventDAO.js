'use strict'
let q = require('q');
var mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let EventModel = require('../model/eventModel');
Grid.mongo = mongoose.mongo;
let con = mongoose.connection;

class EventDAO {

    findAll(req) {
        var defer = q.defer();
        var event = {};
        EventModel.find({
            companyId: req.decoded.id
        }).then(events => {
            defer.resolve(events);
        }).catch(error => {
            defer.reject(error);
        })
        return defer.promise;
    };

    findById(id) {
        var defer = q.defer();
        var event = {};
        EventModel.findById({
            _id: id
        }).then(events => {
            defer.resolve(events);
        }).catch(error => {
            defer.reject(error);
        })
        return defer.promise;
    };

    persist(req) {
        var defer = q.defer();

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
                defer.resolve(result);
            })
            .catch(err => {
                defer.reject(err);
            });
        return defer.promise;
    };

    update(req) {
        var defer = q.defer();
        EventModel.update({
            _id: req.body.id
        }, {
            $set: {
                name: req.body.event.name,
                type: req.body.event.type,
                dateEvent: req.body.event.dateEvent,
                price: req.body.event.price,
                description: req.body.event.description,
                artists: req.body.event.artists,
            }
        }).then(event => {
            defer.resolve();
        }).catch((err) => {
            defer.reject(err);
        });

        return defer.promise;
    };

    findBanner(req) {
        var defer = q.defer();
        let gfs = Grid(con.db);
        gfs.files.find({
            filename: req.body.banner
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
                defer.resolve(banner);
            });

            readstream.on('error', (err) => {
                console.log('An error occurred!', err);
                throw err;
                defer.reject({
                    status: 500,
                    message: "Erro ao pegar banner da base de dados"
                });
            });
        });
        return defer.promise;
    }

    uploadBanner(req) {
        var defer = q.defer();
        let gfs = Grid(con.db);
        let banner = req.files.file;
        let writeStream = gfs.createWriteStream({
            filename: `${banner.name}${req.body.id}`,
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
                    banner: req.files.file.name + req.body.id
                }
            }).then(() => {
                writeStream.on('close', (file) => {
                    defer.resolve(file.filename);
                });

            });
        return defer.promise;
    }
}

module.exports = new EventDAO();