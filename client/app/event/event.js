//attaching controllers to main until we find reason to create specific modules

angular.module('main').controller('eventController',['$scope',
  function($scope){
    console.log("Loading event page...");
    $scope.event = {};
    $scope.event.name = 'Sample Event';
  }
]);

//app.module('main').requires.push('event');