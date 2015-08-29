//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('authController', ['$scope', '$http', 'appFactory', 
  function($scope, $http, appFactory){

    $scope.signIn = function(){
      console.log("signIn form submitted!");

      // $http.post('/auth/signin',$scope.credentials);
    };

    $scope.signUp = function(){

      console.log("signUp form submitted!");

      //$http.post('/auth/signup',$scope.credentials);
    };

  }
]);
