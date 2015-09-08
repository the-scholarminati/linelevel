//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){

    if(appFactory.auth() === true){
      $scope.uData = {};

      var ref = appFactory.firebase;

      var userRef = ref.child('usernames').child($scope.userName);
      userRef.on('value', function(snap) {
        console.log('I fetched a user!', snap.val().uid);

        var userProfile = ref.child('users').child(snap.val().uid);
        userProfile.on('value', function(snap){
          $scope.uData.username = snap.val().username;
          $scope.uData.firstname = snap.val().firstname;
          $scope.uData.lastname = snap.val().lastname;
          $scope.uData.email = snap.val().email;
          $scope.uData.genres = snap.val().chosenGenres;
          $scope.uData.myEvents = snap.val().currentEvents;
        });
      });
    }



  }
]);

//app.module('main').requires.push('userProfile');