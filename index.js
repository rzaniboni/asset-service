'use strict'
const levelup = require('levelup');
//const path = require('path');
const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const options = {
    createIfMIssing: true,
    valueEncoding: 'json'
}

var assetSchemaInsert = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required()
})


var assetSchemaUpdate = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1']}).required(),
    status: Joi.string().alphanum().min(3).max(30).required()
})

var assetSchemaQuery = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1']}).required()
})



module.exports = function(db) {
    return {
        insert,
        update,
        query
    };


    function insert(object, cb) {
        Joi.validate(object, assetSchemaInsert, function (err, value) {
            if (err) return cb(err)
            let id = uuidV1();
            db.put(id, object, function(err) {
                 if (err) return cb(err)
                 cb(null,id)
            })
         });

    }

    function update(object, cb) {
        Joi.validate(object, assetSchemaUpdate, function (err, value) {
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
