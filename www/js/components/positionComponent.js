mapApp.component('position', {
  bindings: { position: '<' },
  templateUrl: 'templates/position.html',
  
  controller : function($log, $state, $http,BreadcrumbService) {
    var self = this;
    self.breadcrumbs;
    self.data = BreadcrumbService.getData();
    self.selected = BreadcrumbService.getSelected();
    self.editMode = false;
    self.save;
    self.cancel;
    self.edit;
    self.editDescription;
    
  //-----------------------------
  // BEGIN BREADCRUMBS
  //-----------------------------
  
    // Function to search tree for selected object based on what job the user searched for on
    // the previous page
    var searchTree = function(node, path) {
      if(node.id === self.selected){ // If search is found return, add the object to the path and return it
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
      } else { // Not the right object, return false so it will continue to iterate in the loop
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
      self.editDescription = self.position.description;
    }
    
    self.save = function() {
      $http.put('/' + self.position.id, self.position)
           .success(function(data) {
             self.position.description = self.editDescription;
             self.cancel();
           })
           .error(function(data) {
             $log.info(data);
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