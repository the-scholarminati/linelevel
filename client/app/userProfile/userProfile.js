//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){
    if(appFactory.auth() === true){
      $scope.userData = [];
      var ref = appFactory.firebase;
      var userRef = ref.child('users').child(ref.getAuth().uid);
      console.log(ref.getAuth().uid);

      userRef.once('value', function(snap) {
        console.log('I fetched a user!', snap.val());
        $scope.userData.push(snap.val());
      });

    }



  }
]);

//app.module('main').requires.push('userProfile');