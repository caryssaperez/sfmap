mapApp.service('BreadcrumbService', function() {
  var selectedId;
  var data;
  
  var setData = function(newData) {
    data = newData;
  }
  
  var setSelected = function(selected) {
    selectedId = selected;
  }
  
  var getSelected = function() {
    return selectedId;
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