//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('aboutController', ['$scope', 'appFactory',
  function($scope,appFactory){
    appFactory.init($scope);
  }
]);