//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('authController', ['$scope', '$http', 'appFactory', '$state',
  function($scope, $http, appFactory, $state){
    // this scope variable will create an error message for you at the top of the form
    // example use: $scope.error = "That username does not exist"
    $scope.error = '';

    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    // this is the list of the user's chosen genres
    $scope.chooseGenre = appFactory.chooseGenre;

    // variables that connects to firebase
    var ref = appFactory.firebase;
    var users = ref.child("users");
    var usernames = ref.child("usernames");

    $scope.signIn = function(inputEmail,inputPassword){
      // saves data from form
      var email = inputEmail || $scope.credentials.email;
      var password = inputPassword|| $scope.credentials.password;

      // clears form
      $scope.credentials = {};


      // authenticate user
      ref.authWithPassword({
        email: email,
        password: password
      },function(error, authData){
        if(error){
          console.log('error: ', error);
        } else {
          console.log('success!');
          $state.go('home');
        }
      });
    };

    $scope.signUp = function(){
      // saves data from form
      var firstname = $scope.credentials.firstname;
      var lastname = $scope.credentials.lastname;
      var username = $scope.credentials.username;
      var password = $scope.credentials.password;
      var email = $scope.credentials.email;
      var chosenGenres = appFactory.chosenGenres;
      var uid = "";

      // create new user in firebase authentication
      usernames.child(username).on("value",function(name){
        if(name.val() === null){
          ref.createUser({
            email: email,
            password: password
          },function(error,userData){
            if (error){
              console.log('Error: ', error);
            } else {
              console.log('userData is ', userData);
              users.child(userData.uid).set({
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                chosenGenres: chosenGenres,
                uid: userData.uid
              });
              usernames.child(username).update({a:true});
              $scope.error = "";
              $scope.signIn(email,password);
            }
          });
        } else {
          if(!$scope.$$phase){
            $scope.$apply(function(){
              $scope.error = "username already exists!";
            });
          } else {
            $scope.error = "username already exists!";
          }
        }
      });

      // clears form
      $scope.credentials = {};
      appFactory.resetGenres();
    };

  }
]);
