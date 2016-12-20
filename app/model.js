var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set the expected fields for the position
var positionSchema = new Schema({
  id : {type: String, required:true},
  name : {type: String, required:true},
  team : {type: String, required:true},
  cloud : {type: String, required:true},
  parent : {type: String, required:true},
  description : {type: String, required:true}
});

// Expose this for use elsewhere
module.exports = mongoose.model('job', positionSchema);