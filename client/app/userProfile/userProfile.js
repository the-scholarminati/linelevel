//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){

    if(appFactory.auth() === true){
      $scope.uData = {};
      $scope.uData.events = [];
      $scope.uData.eventIds = [];

      var ref = appFactory.firebase;

      var userRef = ref.child('usernames').child($scope.userName); //$scope.userName
      userRef.on('value', function(snap) {
        console.log('I fetched a user!', snap.val().uid);

        var userProfile = ref.child('users').child(snap.val().uid);
        userProfile.on('value', function(snap){
          appFactory.update($scope, function(scope){
            scope.uData.username = snap.val().username;
            scope.uData.firstname = snap.val().firstname;
            scope.uData.lastname = snap.val().lastname;
            scope.uData.email = snap.val().email;
            scope.uData.genres = snap.val().chosenGenres;
            scope.uData.eventIds = snap.val().currentEvents;

            var eventIds = scope.uData.eventIds;
            console.log(scope.uData);
            angular.forEach(eventIds, function(eventId){
              ref.child('events').child(eventId).on('value', function(snap){
                scope.uData.events = snap.val();
                console.log(scope.uData.events);
                
              });
            });
          });
        });
      });
    }



  }
]);

//app.module('main').requires.push('userProfile');