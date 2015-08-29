//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('authController', ['$scope', '$http', 'appFactory', 
  function($scope, $http, appFactory){
    // this scope variable will create an error message for you at the top of the form
    // example use: $scope.error = "That username does not exist"
    $scope.error;

    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    // this is the list of the user's chosen genres
    $scope.chosenGenres = appFactory.chosenGenres;
    $scope.chooseGenre = appFactory.chooseGenre;

    $scope.signIn = function(){
      // saves data from form
      var username = $scope.credentials.username;
      var password = $scope.credentials.password;

      // clears form
      $scope.credentials = {};

      // console log to test the button is working
      console.log("signIn form submitted!");


      // TODO: send user data to database for authentication


      // $http.post('/auth/signin',$scope.credentials);
    };

    $scope.signUp = function(){
      // saves data from form
      var firstname = $scope.credentials.firstname;
      var lastname = $scope.credentials.lastname;
      var username = $scope.credentials.username;
      var password = $scope.credentials.password;
      var email = $scope.credentials.email;
      var chosenGenres = $scope.chosenGenres;

      // clears form
      $scope.credentials = {};
      appFactory.resetGenres();

      // console log to test the button is working
      console.log("signUp form submitted!");


      // TODO: send user data to database for authentication


      //$http.post('/auth/signup',$scope.credentials);
    };

  }
]);
