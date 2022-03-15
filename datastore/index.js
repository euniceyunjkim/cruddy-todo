const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var name = id + '.txt';
    var fullPath = path.join(exports.dataDir, name);
    fs.writeFile(fullPath, text, (err) => {
      if (err) {
        throw ('error writing file');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {

  var data = [];

  fs.readdir(exports.dataDir, (err, fileData) => {
    if (err) {
      throw ('no files in directory');
    } else {
      _.each(fileData, (title) => {
        var id = title.split('.');
        var result = {};
        result.id = id[0];
        result.text = id[0];
        data.push(result);
        // var result = {};
        // var fullPath = path.join(exports.dataDir, title);
        // var id = title.split('.');
        // fs.readFile(fullPath, (err, data) => {
        //   result.id = id[0];
        //   result.text = data;
        //   data.push(result);
        // });
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {

  var result = {};
  var name = id + '.txt';
  var fullPath = path.join(exports.dataDir, name);

  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      result.id = id;
      result.text = data;
      callback(null, result);
    }
  });
};


exports.update = (id, text, callback) => {

  var name = id + '.txt';
  var fullPath = path.join(exports.dataDir, name);

  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(fullPath, text, 'utf8', (err) => {
        if (err) {
          throw ('cannot update file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.delete = (id, callback) => {

  var result = {};
  var name = id + '.txt';
  var fullPath = path.join(exports.dataDir, name);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      delete result.id;
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
