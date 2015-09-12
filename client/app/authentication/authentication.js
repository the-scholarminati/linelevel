//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('authController', ['$scope', '$http', 'appFactory', '$state', '$location',
  function($scope, $http, appFactory, $state, $location){
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
    var emails = ref.child("emails");

    $scope.signIn = function(inputEmail, inputPassword){
      // saves data from form
      var email = inputEmail || $scope.credentials.email;
      var password = inputPassword || $scope.credentials.password;

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
          ref.child('users').child(authData.uid).on('value' , function(user){
            console.log(user.val().username);
            appFactory.user = user.val().username;
            console.log('success! Logged in', appFactory.user);

            // if prevRoute has somehow gone missing, set it back to home page
            appFactory.prevRoute = appFactory.prevRoute || '/';

            // redirect user back to previous page
            $location.path(appFactory.prevRoute);
            $scope.$apply();
          });
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
      var image = $scope.credentials.image;
      var chosenGenres = appFactory.chosenGenres;
      var uid = "";

      // modify email so it can be accepted by firebase
      var emailFirebase = email.replace(/\./g,"!");

      // create new user in firebase authentication
      emails.child(emailFirebase).on("value", function(em){
        if(em.val() === null){
          // check if username already exists in db
          usernames.child(username).on("value",function(name){
            if(name.val() === null){
              ref.createUser({
                email: email,
                password: password
              },function(error,userData){
                if (error){
                  console.log('Error: ', error);
                } else {
                  // code here means email and username are unique
                  console.log('userData is ', userData);
                  users.child(userData.uid).set({
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    email: email,
                    image: image,
                    chosenGenres: chosenGenres,
                    uid: userData.uid
                  });
                  usernames.child(username).update({a:true});
                  $scope.error = "";
                  $scope.signIn(email,password);

                  // clears form
                  $scope.credentials = {};
                  appFactory.resetGenres();
                }
              });
            } else {
              // code here means username is not unique
              appFactory.update($scope,function(scope){
                scope.error = "username already exists!";
              });
            }
          }); // end of username check
        } else {
          // code here means email is not unique
          appFactory.update($scope,function(scope){
            scope.error = "email already in use!";
          });
        }
      });
    };

  }
]);
