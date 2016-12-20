// Load in all the modules for this app
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var app = express();
var clientDir = path.join(__dirname, '/www');
var url = 'mongodb://localhost/SFRelationships';

// Set the URL and connect to db
// mongoose.connect(url, function(err) {
//   if(err) {
//     throw err;
//   }
//   console.log("Successfully connected to db.")
// });

// Create express application and assign directory from where to load app.
// Parse the data posted as JSON and exposes the data to the request's body, 
// only parses urlencoded bodies (application/x-www-form-urlencoded)
app.use(express.static(clientDir));
// app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded({ extended: true }));
// 
// // Simulate DELETE and PUT  
// app.use(methodOverride('X-HTTP-Method-Override')); 
// 
// // Configure routes
// require('./app/routes.js')(app);

// Set port and listen at that port
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);

// module.exports = app;