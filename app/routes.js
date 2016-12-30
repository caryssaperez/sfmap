var mongoose = require('mongoose');
var Position = require('./model.js');
var express = require('express');
var router = express.Router();

// Middleware to use for all requests.
router.use(function(req, res, next) {
	next();
});

// Opens app routes, passing the express app in. 
router.route('/jobs')
  .get(function(req, res) {// Method to get records for all the positions in the db
    Position.find(function(err, positions) {
      if(err) { // If there is an error, show the error.
         return res.send(err);
      }
      
      return res.json(positions); // Otherwise, return the positions.
    });
  })
  .post(function(req, res) { // Method to post new records to the db
    // Make new position based off the schema and post body
    var newPosition = new Position(req.body);
    
    newPosition.save(function(err) {
      if(err) {
        return res.send(err);
      } else {
        return res.json(req.body);
      }
    });
  });

router.route('/jobs/:positionId')
  .get(function(req,res) {
    Position.findById(req.params.positionId, function(err, position) {
      if(err) {
         return res.send(err);
      }
      return res.json(position);
    })
  })
  .put(function(req,res) {
    Position.findById(req.params.positionId, function(err, position) {
			console.log(req.body);
      if(err) {
         return res.send(err);
      }
			
			if(req.body.path) {
				position.path = req.body.path;
			}
			if(req.body.name) {
				position.name = req.body.name;
			}
			if(req.body.team) {
				position.team = req.body.team;
			}
			if(req.body.cloud) {
				position.cloud = req.body.cloud;
			}
			if(req.body.parent) {
				position.parent = req.body.parent;
			}
      if(req.body.description) {
				position.description = req.body.description;
			}   
			if(req.body.reports) {
				position.reports = req.body.reports;
			}
			if(req.body.primary) {
				position.primary = req.body.primary;
			} 
			if(req.body.secondary) {
				position.secondary = req.body.secondary;
			}    
      
			position.save(function(err) {
        if(err) {
           return res.send(err);
        }
        return res.json(position);
      });
    });
  });
  
module.exports = router;