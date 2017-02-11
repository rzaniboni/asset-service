'use strict'
var Writable = require('stream').Writable;
var util = require('util');
const levelup = require('levelup');
const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const options = {
    createIfMIssing: true,
    valueEncoding: 'json'
}

//test
var assetSchemaInsert = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    status: Joi.string().alphanum().min(3).max(30).required()
})


var assetSchemaUpdate = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1'] }).required(),
    status: Joi.string().alphanum().min(3).max(30).required()
})

var assetSchemaQuery = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1'] }).required()
})



function AssetWritable(obj) {
    if (!(this instanceof AssetWritable)) return new AssetWritable(obj);
    Writable.call(this, { objectMode: true })
    this.obj = obj;
}

util.inherits(AssetWritable, Writable);

AssetWritable.prototype._write = function write(doc, encoding, callback) {
    try {
        console.log("writing", doc)
        this.obj.insert(doc, callback)
    } catch (err) {
      console.log(err)
    }
};


module.exports = function(db) {
    var obj = {
        createWritableStream: createWritableStream,
        insert,
        update,
        query
    };

    return obj

    function createWritableStream() {
        return new AssetWritable(obj)
    }

    function insert(object, cb) {
        Joi.validate(object, assetSchemaInsert, function(err, value) {
            if (err) return cb(err)
            let id = uuidV1();
            db.put(id, object, function(err) {
                if (err) return cb(err)
                cb(null, id)
            })
        });

    }

    function update(object, cb) {
        Joi.validate(object, assetSchemaUpdate, function(err, value) {
            if (err) return cb(err)

            db.get(object.id, function(err, value) {
                if (err) return cb(err)
                value.status = object.status

                db.put(object.id, value, function(err) {
                    if (err) return cb(err)
                    cb()
                })
            })
        })
    }


    function query(object, cb) {
        Joi.validate(object, assetSchemaQuery, function(err, value) {
            if (err) return cb(err)

            db.get(object.id, function(err, value) {
                if (err) return cb(err)
                if (!value) return cb(new Error('no values'))
                cb(null, value)
            })
        });
    }
}
