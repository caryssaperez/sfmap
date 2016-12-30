mapApp.component('position', {
  bindings: { position: '<' },
  templateUrl: 'templates/position.html',
  
  controller : function($log, $state, $http, BreadcrumbService) {
    var self = this;
    self.breadcrumbs;
    self.data = BreadcrumbService.getData();
    self.selected = BreadcrumbService.getSelected();
    self.editMode = false;
    
    // Declare function variables to be defined later 
    self.save;
    self.cancel;
    self.edit;
    
    // Initialize variables to store the data values of this position
    self.editPath = "";
    self.editName = "";
    self.editTeam = "";
    self.editCloud = "";
    self.editDescription = "";
    self.editParent = "";
    self.editReports = [];
    self.editPrimary= [];
    self.editSecondary = [];
    self.editResources = "";
      
  //-----------------------------
  // BEGIN BREADCRUMBS
  //-----------------------------
  
    // Function to search tree for selected object based on what job the user searched for on
    // the previous page
    var searchTree = function(node, path) {
      if(node.path === self.selected){ // If search is found return, add the object to the path and return it
        path.push(node);
        return path;
      } else if(node.children || node._children) { // If node has open or collapsed children,
        var children = (node.children) ? node.children : node._children; // assign the children regardless if they are open or collapsed,
        for(var i = 0;i < children.length;i++) { // cycle through the children of this node,
          path.push(node);// assume this path is the right one
          var found = searchTree(children[i], path); // and recursively call this function to find the searched node
          if(found) { // If found this should return the bubbled-up path from the first if statement
            return found;
          }
          else { // Otherwise, remove this parent from the path and continue iterating
            path.pop();
          }
        }
      } else { // Not the right object, return false 
        return false;
      }
    }  
    
    self.breadcrumbs = searchTree(self.data[0], []);
    
  //-----------------------------
  // END BREADCRUMBS
  //-----------------------------
  
  //-----------------------------
  // BEGIN EDIT MODE
  //-----------------------------
  
    self.edit = function() {
      self.editMode = true;
      self.editPath = self.position.path;
      self.editName = self.position.name;
      self.editTeam = self.position.team;
      self.editCloud = self.position.cloud;
      self.editDescription = self.position.description;
      self.editParent = self.position.parent;
      self.editReports = self.position.reports;
      self.editPrimary = self.position.primary;
      self.editSecondary = self.position.secondary;
      
      self.editResources = "";
      var count = Object.keys(self.position.resources).length;
      var i = 0;
      for (var key in self.position.resources) {
        i++;
        if(self.position.resources.hasOwnProperty(key) && (i <= (count - 1)) ) {
          self.editResources += key + ":" + self.position.resources[key] + ",";
        } else {
          self.editResources += key + ":" + self.position.resources[key];
        }
      }
    }
    
    self.save = function() {
      // Assign values from inputs to the position, handling empty values
      if(!self.editPath) {
        self.position.path = null;
      } else {
        self.position.path = self.editPath;
      }
      
      if(!self.editName) {
        self.position.name = null;
      } else {
        self.position.name = self.editName;
      }
      
      if(!self.editTeam) {
        self.position.team = null;
      } else {
        self.position.team = self.editTeam;
      }
      
      if(!self.editCloud) {
        self.position.cloud = null;
      } else {
        self.position.cloud = self.editCloud;
      }
      
      if(!self.editDescription) {
        self.position.description = null;
      } else {
        self.position.description = self.editDescription;
      }
      
      if(!self.editParent) {
        self.position.parent = null;
      } else {
        self.position.parent = self.editParent;
      }
      
      if(self.editReports.length == 0) {
        self.position.reports = [];
      } else {
        arrayRep = self.editReports.split(",");
        self.position.reports = arrayRep;
      }
      
      if(self.editPrimary.length == 0) {
        self.position.primary = [];
      } else {
        self.position.primary = self.editPrimary;
      }
      
      if(self.editSecondary.length == 0) {
        self.position.secondary = [];
      } else {
        self.position.secondary = self.editSecondary;
      }
      
      var resources = self.editResources.split(",");
      var key;
      var value;
      var temp;
      self.position.resources = {};
      
      for(var i = 0; i < resources.length; i++) {
        temp = resources[i];
        key = temp.substring(0, temp.indexOf(":"));
        value = temp.substring(temp.indexOf(":") + 1, temp.length);
        self.position.resources[key] = value;
      }
      
      $log.info(self.position);
      
      $http.put('/api/jobs/' + self.position._id, self.position)
           .success(function(data) {
             self.cancel();
           })
           .error(function(data) {
             alert("Sorry, something went wrong.")
           });
    }
    
    self.cancel = function() {
      self.editMode = false;
    }
    
  //-----------------------------
  // END EDIT MODE
  //-----------------------------
  }
})