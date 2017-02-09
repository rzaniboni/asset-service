'use strict'
const test = require('tap');
const levelup = require('levelup')
const assertService = require('../index')

const filepath = './tmp/mydb'
let db = levelup(filepath)
let assert =  { name : 'my_new_assert' }
assertService(filepath).insertAssert(assert, function(err, id){
  db.get(id, function(err, value){
    tap.deepEqual(value, assert)
  })
})
