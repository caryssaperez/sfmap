mapApp.component('search', {
  bindings: { jobs: '=' },
  templateUrl: 'templates/search.html',
  
  controller : function($timeout, $q, $log) {
    var self = this;
    self.simulateQuery = false;
    self.isDisabled = false;
    self.items = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;

    // ******************************
    // Internal methods
    // ******************************
    function querySearch (query) {
      var results = query ? self.jobs.filter(createFilterFor(query)) : self.jobs,
         deferred;
      if (self.simulateQuery) {
       deferred = $q.defer();
       $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
       return deferred.promise;
      } else {
        return results;
      }
    }

    function selectedItemChange(item) {
      var id = item.id;
      self.selectedId = id;
    }

    function loadAll() {
      var jobs = self.jobs;
      
      return jobs.map( function (position) {
          position.value = position.name.toLowerCase();
          return position;
      });
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }
})