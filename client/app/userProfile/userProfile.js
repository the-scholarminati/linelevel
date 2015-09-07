//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){
    if(appFactory.auth() === true){
      $scope.userData = [];

      var ref = appFactory.firebase;

      var userRef = ref.child('usernames').child($scope.userId);

      userRef.once('value', function(snap) {
        console.log('I fetched a user!', snap.val().uid);

        var userProfile = ref.child('users').child(snap.val().uid);
    
        userProfile.once('value', function(snap){
          console.log(snap.val().username);
          $scope.userData.push(snap.val());
          console.log($scope.userData);
        });
      });


    }



  }
]);

//app.module('main').requires.push('userProfile');