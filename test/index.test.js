'use strict'
const tap = require('tap');
const levelup = require('levelup')
const assertService = require('../index')
const Memdb = require('memdb')
const options = {
    createIfMIssing: true,
    valueEncoding: 'json'
}
let db = Memdb(options)




tap.test('test wrong param in Insert', t => {
  let assert = {nome:'ilnome'}
  assertService(db).insert(assert, function(err, id){
    t.ok(err)
    t.end()
  })
})



tap.test('test Insert ok' , t => {
  let assert = {name:'ilmioassert'}
  assertService(db).insert(assert, function(err, id){
    t.notOk(err)
    t.ok(id)
    t.end()
  })
})

tap.test('test wrong param in Update' , t => {
  let assert = { id :'ilmioassert' }
  assertService(db).update(assert, function(err, id){
    t.ok(err)
    t.end()
  })
})

tap.test('test update ok' , t => {
  let assert = { name:'ilmioassert' }
  assertService(db).insert(assert, function(err, id) {
    t.notOk(err)
    assertService(db).update({ id: id , status: 'updated' }, function(err){
      t.notOk(err)
      t.end()
    })
  })
})

tap.test('test query id not exists', t => {
  let assert = { name:'ilmioassert' }
  assertService(db).insert(assert, function(err, id) {
    t.notOk(err)
    assertService(db).query( {id: '1234'}, function (err, object){
      t.ok(err)
      t.end()
    })
  })
})

tap.test('test query id ok', t => {
  let assert = { name:'ilmioassert' }
  assertService(db).insert(assert, function(err, id) {
    t.notOk(err)
    assertService(db).update({ id: id , status: 'updated' }, function(err){
      t.notOk(err)
      assertService(db).query( {id}, function (err, object){
        t.ok(object)
        let expected = {name:'ilmioassert', status: 'updated' }
        t.deepEqual(expected, object)
        t.end()
      })
    })
  })
})
