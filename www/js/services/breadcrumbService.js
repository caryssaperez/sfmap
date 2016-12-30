mapApp.service('BreadcrumbService', function() {
  var selectedPath;
  var data;
  
  var setData = function(newData) {
    data = newData;
  }
  
  var setSelected = function(selected) {
    selectedPath = selected;
  }
  
  var getSelected = function() {
    return selectedPath;
  }
  
  var getData = function() {
    return data;
  }
  
  return {
    setSelected: setSelected,
    getSelected: getSelected,
    setData: setData,
    getData: getData
  };
})