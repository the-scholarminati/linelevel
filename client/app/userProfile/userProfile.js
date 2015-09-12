//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){
    $scope.myProfile = true;
    
    if($scope.userName !== appFactory.user){
      $scope.myProfile = false;
    }

    $scope.followers = [];

    $scope.followUser = function(){
      appFactory.followUser($scope.userName, true);
    };

    $scope.following = function(list, cb){
      angular.forEach(list, function(user){
        cb(user.uid);
      });
    };

    $scope.submitWallMsg = function(){
      var text = $scope.wallText;
      appFactory.accessUserByUid(ref.getAuth().uid, function(snap){
        if($scope.userName === snap.val().username){
          console.log("Make something happen");
          $scope.wallText = '';
        }
        else {
          ref.child('users').child($scope.uData.uid).child('wall').push({username: snap.val().username, message: $scope.wallText,
          timestamp: (new Date()).getTime()});
          $scope.wallText = '';
        }
      });
    };

    if(appFactory.auth() === true){
      var ref = appFactory.firebase;

      //who you follow list
      appFactory.getUserFollowList(function(list){
        //retrieve follower info
        angular.forEach(list, function(item){
          appFactory.firebase.child('users').child(item.uid).on('value', function(snap){
            $scope.followers.push(snap.val());
          });
        });
      });

      $scope.uData = {};
      $scope.uData.eventIds = [];
      $scope.uData.myEvents = [];
      $scope.uData.myWall = [];
      $scope.uData.uid;

      appFactory.accessUserByUsername($scope.userName, function(snap){
        var userProfile = ref.child('users').child(snap.val().uid);

        userProfile.child('wall').on('child_added', function(snap){
          $scope.uData.myWall.push(snap.val());
          console.log(snap.val().username);
        });

        userProfile.on('value', function(snap){
          appFactory.update($scope, function(scope){
            scope.uData.image = snap.val().image;
            scope.uData.username = snap.val().username;
            scope.uData.firstname = snap.val().firstname;
            scope.uData.lastname = snap.val().lastname;
            scope.uData.email = snap.val().email;
            scope.uData.genres = snap.val().chosenGenres;
            scope.uData.myEvents.push(snap.val().currentEvents);
            scope.uData.myWall.push(snap.val().wall);
            scope.uData.uid = snap.val().uid;
            console.log(snap.val().uid);
          });
        });
      });
    }




  }
]);

//app.module('main').requires.push('userProfile');