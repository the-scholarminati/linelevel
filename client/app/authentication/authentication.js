angular.module('main')

.controller('authController', ['$http','$scope', 
  function($scope, $http){

    console.log("inside authController");

    $scope.signIn = function(){
      console.log("signIn form submitted!");

      // $http.post('/auth/signin',$scope.credentials);
    };
    $scope.signUp = function(){
      console.log("$scope.credentials.firstname = ", $scope.credentials.firstname);

      console.log("signUp form submitted!");

      //$http.post('/auth/signup',$scope.credentials);
    };
  }
]);