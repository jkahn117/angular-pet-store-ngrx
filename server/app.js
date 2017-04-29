'use strict'

/**


 https://github.com/expressjs/express/blob/master/examples/route-separation/index.js

 */

const express        = require('express');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');

//require('dotenv').config()

//--- routes
var pets  = require('./routes/pets');
//var store = require('./routes/store');
//var user  = require('./routes/user');

//---
var app = express();
app.use(bodyParser.json());
app.use(methodOverride());

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.code || 500)
      .json({
        success: false,
        message: err
      });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.code || 500)
    .json({
      success: false,
      message: err.message
    });
});

module.exports = app;


// pet routes
app.get('/pets',        pets.list);     // list pets
app.get('/pets/:id',    pets.get);      // find pet by 
app.post('/pets',       pets.create);   // create new pet
app.put('/pets/:id',    pets.update);   // update existing pet
app.delete('/pets/:id', pets.delete);   // delete existing pet

// store routes



// user routes



var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});