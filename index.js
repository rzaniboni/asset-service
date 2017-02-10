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
    name: Joi.string().alphanum().min(3).max(30).required()
})


var assetSchemaUpdate = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1'] }).required(),
    status: Joi.string().alphanum().min(3).max(30).required()
})

var assetSchemaQuery = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1'] }).required()
})





module.exports = function(db) {
    return {
        createWritableStream: createWritableStream,
        insert,
        update,
        query
    };

    function AssetWritable(options) {
      if (! (this instanceof AssetWritable)) return new AssetWritable(options);
      if (! options) options = {};
      options.objectMode = true;
      Writable.call(this, options);
    }

    util.inherits(AssetWritable, Writable);

    AssetWritable.prototype._write = function write(doc, encoding, callback) {
      insert(doc, callback)
    };

    function createWritableStream() {
      return new AssetWritable()
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
        Joi.validate(object, assetSchemaQuery, function (err, value) {
            if (err) return cb(err)

            db.get(object.id, function(err, value) {
                if (err) return cb(err)
                if (!value) return cb(new Error('no values'))
                cb(null, value)
            })
        });
    }
}
