mapApp.component('add', {
  templateUrl: 'templates/add.html',
  
  controller : function($http, $log, $state) {
    var self = this;
    self.add;
    self.new = {};
    
    // Initialize variables to pass into the POST request
    self.new.path = "";
    self.new.name = "";
    self.new.team = "";
    self.new.cloud = "";
    self.new.parent = "";
    self.new.description = "";
    self.new.reports = [];
    self.new.primary = [];
    self.new.secondary = [];
    self.new.resources = {};
    self.tempRes = [];
        
    self.add = function() {
      // Process the data taken for the array variables.
      var arrayRep = self.new.reports.split(",");
      self.new.reports = arrayRep;
      
      var arrayPri = self.new.primary.split(",");
      self.new.primary = arrayPri;
      
      var arraySec = self.new.secondary.split(",");
      self.new.secondary = arraySec;
      
      // Process the data for the object variable
      var resources = self.tempRes.split(",");
      var key = "";
      var value = "";
      var temp = "";
      
      for(var i = 0; i < resources.length; i++) {
        temp = resources[i];
        key = temp.substring(0, temp.indexOf(":"));
        value = temp.substring(temp.indexOf(":") + 1, temp.length);
        self.new.resources[key] = value;
      }
            
      $http.post('/api/jobs', self.new)
           .success(function(data) {
            $state.go('jobs.position', { positionPath: self.new.path });
           })
           .error(function(data) {
             alert("Sorry, something went wrong.")
           });
    }
  }
})