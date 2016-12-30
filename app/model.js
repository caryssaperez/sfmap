var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set the expected fields for the position. Mongoose will throw an error if a
// field is added that does not meet the type criteria 

// 'path' is the string that goes in URL, all lowercase and use hyphens instead 
// of spaces for cleaner URLS. 

//'name' is the name of the position, use title case. 'team' is the team the position
// is a part of, use title case. 

//'cloud' is the cloud the team is a part of, use title case and only the name 
// of the cloud (do not include the word "cloud").

// 'parent' is the immediate superior of this position, makes it easier to parse
// hierachy for the breadcrumbs, use the position title of the superior 

// 'description' is the short blurb about the position.

// 'reports' is the array of positions that report to this one, use the position paths 
// to populate this array ("creative-developer" instead of "Creative Developer")

// 'primary' is the array of positions that this one has a primary relationship with,
// use position titles ("Solutions Support" instead of "solutions-support"), sorry for the
// inconsistency

// 'secondary' is the exact same as 'primary' except with secondary relationships

// 'resources' is an object that stores the anchor text and href of each resource,
// use "key" : "value" format, "key" must use title case. "value" is the full URL to 
// your resource, including "http://" or "https://" 

var positionSchema = new Schema({
  path : String,
  name : String,
  team : String,
  cloud : String,
  parent : String,
  description : String,
  reports: Array,
  primary: Array,
  secondary: Array,
  resources: Schema.Types.Mixed
});

// Expose this for use elsewhere
module.exports = mongoose.model('job', positionSchema); 