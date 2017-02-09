'use strict'
const levelup = require('levelup');
//const path = require('path');
const Joi = require('joi');
const uuidV1 = require('uuid/v1');
const options = {
    createIfMIssing: false,
    valueEncoding: 'json'
}
let db;

var assetSchemaInsert = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required()
}).with('name');


var assetSchemaUpdate = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1']}).required(),
    status: Joi.string().alphanum().min(3).max(30).required()
}).with('id','status')

var assetSchemaQuery = Joi.object().keys({
    id: Joi.string().guid({ version: ['uuidv1']}).required()
}).with('id')

function insert(object, cb) {
    Joi.validate(object, assetSchemaInsert, function (err, value) {
        if (err) cb(err)
        let id = uuidV1();
        db.put(id, object, function(err) {
             if (err) cb(err)
             cb(id)
        })
     });  
    
}

function update() {
    Joi.validate(object, assetSchemaUpdate, function (err, value) {
        if (err) cb(err)

        db.get(object.id, function(err, value) {
            if (err) cb(err)
            db.put(id, value, function(err) {
                if (err) cb(err)
                cb();
            })
        })
    

     });  
    
}

function query(object) {
    Joi.validate(object, assetSchemaQuery, function (err, value) {
        if (err) cb(err)
        db.get(object.id, function(err, value) {
            if (err) cb(err)
            cb(value);
        })
     });  
}


module.exports = function(filePath) {


    db = levelup(filePath, options);    

    return {
        insert: insert,
        update: update,
        query: query
    };
}