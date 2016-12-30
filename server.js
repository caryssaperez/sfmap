// Load in all the modules for this app
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');


var app = express(); // Make the express app.
var clientDir = path.join(__dirname, '/www'); // Create the path to the frontend directory.
var url = 'mongodb://localhost/SFRelationships'; // Assign the url to the db.

// Connect to the db.
mongoose.connect(url, function(err) {
  if(err) {
    throw err;
  }
  console.log("Successfully connected to db.")
});

// Create express application and assign directory from where to load app.
// Parse the data posted as JSON and exposes the data to the request's body
app.use(express.static(clientDir));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override')); 

// Configure routes
var routes = require('./app/routes.js')
app.use('/api',routes);

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/www/index.html');
});

// Set port and listen at that port
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);

// module.exports = app;