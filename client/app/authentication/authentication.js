angular.module('main')
  .controller('AuthController', ['$http','$scope', function($scope,$http){
    $scope.signIn = function(){
      $http.post('/auth/signin',$scope.credentials);
    };
    $scope.signUp = function(){
      $http.post('/auth/signup',$scope.credentials);
    };
  }
  ]);