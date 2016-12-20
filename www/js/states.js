var mapApp = angular.module('SFMap', ['ui.router','ngMaterial','ngMessages','material.svgAssetsCache']);

mapApp.config(function($stateProvider) {
  var states = [
    // {
    //   name: 'jobs',
    //   url:'',
    //   component: 'jobs',
    //   resolve: {
    //     jobs: function($http) {
    //       $http.get('/jobs').success(function(res, req) {
    //          console.log(res);
    //          return res;
    //       })
    //       .error(function(){});
    //     }
    //   }
    // },
    {
      name: 'jobs',
      url:'',
      component: 'jobs',
      resolve: {
        jobs: function(PositionService) {
          return PositionService.getAllPositions();
        }
      }
    },
    {
      name: 'jobs.position',
      url: '/{positionId}',
      component: 'position',
      resolve: {
        position: function(jobs, $stateParams) {
          return jobs.nodes.find(function(position) {
            return position.id === $stateParams.positionId;
          });
        }
      }
    }
  ];
  
  states.forEach(function(state) {
    $stateProvider.state(state);
  });
});