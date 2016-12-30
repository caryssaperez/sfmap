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
    Position.findById(req.params.positionId, function(err, updatePosition) {
      if(err) {
         return res.send(err);
      }
			updatePosition.path = req.body.path;
			updatePosition.name = req.body.name;
			updatePosition.team = req.body.team;
			updatePosition.cloud = req.body.cloud;
			updatePosition.parent = req.body.parent;
			updatePosition.description = req.body.description;
			updatePosition.reports = req.body.reports;
			updatePosition.primary = req.body.primary;
			updatePosition.secondary = req.body.secondary;
			updatePosition.resources = {};
			updatePosition.resources = req.body.resources;
			
			console.log(updatePosition);
			updatePosition.save(function(err) {
        if(err) {
           return res.send(err);
        }
        return res.json(updatePosition);
      });
    });
  })
	.delete(function(req, res) {
		Position.remove({
			_id: req.params.positionId
		}, function(err, deletePosition) {
			if (err) {
				return res.send(err);
			}

			return res.json({ message: 'Successfully deleted' });
		});
	});
  
module.exports = router;