var mapApp = angular.module('SFMap', ['ui.router','ngMaterial','ngMessages','material.svgAssetsCache']);

mapApp.config(function($stateProvider, $locationProvider) {
  var states = [
    {
      name: 'jobs',
      url:'',
      component: 'jobs',
      resolve: {
        data: function(PositionService) {
          return PositionService.getAllPositions();
        }
      }
    },
    {
      name: 'jobs.add',
      url:'/add',
      component: 'add'
    },
    {
      name: 'jobs.position',
      url: '/{positionPath}',
      component: 'position',
      resolve: {
        position: function(data, $stateParams) {
          return data.find(function(position) {
            return position.path === $stateParams.positionPath;
          });
        }
      }
    }
  ];
  
  states.forEach(function(state) {
    $stateProvider.state(state);
  });
  
  $locationProvider.html5Mode(true);
});