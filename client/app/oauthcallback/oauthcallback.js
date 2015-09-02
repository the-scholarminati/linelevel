angular.module('main').controller('accessController',['appFactory','$scope',function(appFactory,$scope){
  console.log('loading accessController');
  $scope.accessToken;
  $scope.authenticationToken;

}]);