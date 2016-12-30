mapApp.service('PositionService', function($http) {
  var service = {
    getAllPositions: function() {
      return $http.get('/api/jobs').then(function(resp){
          return resp.data;
      });
    },
    
    getPosition: function(id) {
      function positionMatch(position) {
        return position.path === path;
      }
      
      return service.getAllPositions().then(function(data) {
        return data.find(positionMatch)
      });
    }
  }
  
  return service;
})