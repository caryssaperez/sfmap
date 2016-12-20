mapApp.service('PositionService', function($http) {
  var service = {
    getAllPositions: function() {
      return $http.get('data/positions.json', { cache: true }).then(function(resp){
          return resp.data;
      });
    },
    
    getPosition: function(id) {
      function positionMatch(position) {
        return position.id === id;
      }
      
      return service.getAllPositions().then(function(jobs) {
        return jobs.nodes.find(positionMatch)
      });
    }
  }
  
  return service;
})