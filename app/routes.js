var mongoose = require('mongoose');
var Position = require('./model.js');

// Opens app routes, passing the express app in. 
module.exports = function(app) {
  // Method to get records for all the positions in the db
  app.get('/jobs', function(req, res) {
    Position.find(function(err, positions) {
      if(err) { // If there is an error, show the error
        return res.send(err);
      }
      
      return res.json(positions); // Otherwise, return the JSON of positions
    });
  });
  
  // Method to post new records to the db
  app.post('/jobs', function(req, res) {
    // Make new position based off the schema and post body
    var newPosition = new Position(req.body);
    
    newPosition.save(function(err) {
      if(err) {
        res.send(err);
      } else {
        res.json(req.body);
      }
    });
  });
  // 
  // app.put('/jobs/:positionId', function(req,res) {
  //   Position.findById(req.params.positionId, function(err, position) {
  //     if(err) {
  //       res.send(err);
  //     }
  //     
  //     position.name = req.body.name; // Update the name for now
  //     
  //     position.save(function(err) {
  //       if(err) {
  //         res.send(err);
  //       }
  //     });
  //   });
  // });
};