const assertService = require('./index')
const Memdb = require('memdb')
const options = {
    createIfMIssing: true,
    valueEncoding: 'json'
}
let db = Memdb(options)

var AssetService = require('./index');
var writeStream = AssetService(db).createWritableStream();

var Readable = require('stream').Readable;
var util = require('util');
var namesgenerator = require('docker-namesgenerator')
  , names = {}
  , i
  , name
  ;


function NameGenerator(options) {
  if (! (this instanceof NameGenerator)) return new NameGenerator(options);
  if (! options) options = {};
  options.objectMode = true;
  Readable.call(this, options);
}

util.inherits(NameGenerator, Readable);

NameGenerator.prototype._read = function read() {
  var self = this;
  generateName(function(err, name) {
    if (err) self.emit('error', err);
    else self.push({name:name});
  });
};

var namegenerator = new NameGenerator({highWaterMark: 10});

function generateName(cb){
  var checker = function(name) {
    return names.hasOwnProperty(name);
  };
    name = namesgenerator(checker);
    cb(null,name)
}

namegenerator.pipe(writeStream);
