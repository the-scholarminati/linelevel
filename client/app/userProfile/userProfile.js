//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){

    appFactory.init($scope);
    $scope.isAuth = appFactory.auth;
    $scope.myProfile = null;
    $scope.loadPage = false;
    $scope.following = [];
    $scope.myFollowing = [];
    $scope.uData = {};
    $scope.followMessage = '';
    var ref = appFactory.firebase;

    $scope.followUser = function(){
      var followRef = null;
      var message = '';
      if($scope.myProfile){
        followRef = $scope.following;
      } else {
        followRef = $scope.myFollowing;
      }
      if(followRef[$scope.userName] === undefined){
        appFactory.followUser($scope.userName);
        followRef[$scope.userName] = {
          uid: $scope.uData.uid
        };
        message = 'Unfollow';
      } else {
        appFactory.unfollowUser($scope.userName);
        delete followRef[$scope.userName];
        message = 'Follow';
      }
      appFactory.update($scope,function(scope){
        scope.followMessage = message;
      });
    };

    $scope.following = function(list, cb){
      angular.forEach(list, function(user){
        cb(user.uid);
      });
    };

    var initFollowMessage = function(){
      var message = '';
      // if myFollowing is not an array, then it was instantiated because it is not my profile
      if(!Array.isArray($scope.myFollowing)){
        if($scope.myFollowing[$scope.userName]){
          message = 'Unfollow';
        } else {
          message = 'Follow';
        }
      }
      appFactory.update($scope,function(scope){
        scope.followMessage = message;
      });
    };

    // change load page to true if authenticated
    $scope.$watch(function(scope){return scope.isAuth();},function(nv,ov){
      if(nv){
        $scope.loadPage = true;
      }
    });

    // ensures that myProfile variable is always updated
    $scope.$watch(function(scope){return scope.userName !== appFactory.user;},function(nv,ov){
      var outcome;
      if(nv){
        outcome = false;
      } else {
        outcome = true;
      }
      appFactory.update($scope,function(scope){
        scope.myProfile = outcome;
      });
    });
    
    // initialize if load page is true and profile is not empty
    $scope.$watch(function(){return $scope.loadPage;}, function(nv,ov){
      if(nv && $scope.myProfile !== null){
        init();
      }
    });

    $scope.submitWallMsg = function(){
      var text = $scope.wallText;
      if(!text.length){ return;}

      appFactory.accessUserByUid(ref.getAuth().uid, function(snap){
        ref.child("usernames").child($scope.userName).on("value",function(userData){
          ref.child('users').child(userData.val().uid).child('wall').push({
            username: snap.val().username, 
            message: text,
            timestamp: (new Date()).getTime()
          });
        });
        $scope.wallText = '';
      });
    };

    $scope.getTimeStamp = function(timestamp){
      timestamp = (new Date()).getTime() - timestamp;
      var days = Math.floor(timestamp/86400000);
      timestamp%=86400000;
      var hours = Math.floor(timestamp/3600000);
      timestamp%=3600000;
      var minutes = Math.floor(timestamp/60000);
      if(days){ return '' + days + 'd';}
      if(hours){ return '' + hours+ 'h';}
      if(minutes){ return '' + minutes + 'm';}
      return '1m';
    };



    var init = function(){
      $scope.uData.eventIds = [];
      $scope.uData.myEvents = [];
      $scope.uData.myWall = [];
      $scope.uData.uid = '';

      appFactory.accessUserByUsername($scope.userName, function(user){
        var userData = ref.child('users').child(user.val().uid);
        var myData = ref.child('users').child(ref.getAuth().uid);

        // loads a user's information
        userData.on('value', function(snap){
          snap = snap.val();
          userData.off();
          appFactory.update($scope, function(scope){
            scope.uData.image = snap.image || '../assets/profile.jpg';
            scope.uData.username = snap.username;
            scope.uData.firstname = snap.firstname;
            scope.uData.lastname = snap.lastname;
            scope.uData.email = snap.email;
            scope.uData.genres = snap.chosenGenres;
            scope.uData.myEvents.push(snap.currentEvents);
            scope.uData.uid = snap.uid;
            scope.following = snap.following || {};
            scope.following.Tom = {uid:"59070437-1e92-4817-b3d2-ff9d9753379d"};
          });
        });

        // loads my following list
        if(!$scope.myProfile){
          myData.on("value",function(a){
            a = a.val();
            myData.off();
            appFactory.update($scope,function(scope){
              scope.myFollowing = a.following;
            });
          });
        }

        initFollowMessage();
        // loads a user's wall content
        userData.child('wall').on('child_added', function(snap){
          var data = snap.val();
          appFactory.accessUserByUsername(data.username,function(info){
            info = info.val();
            data.image = info.image || '../assets/profile.jpg';
            data.fullname = info.firstname + ' ' + info.lastname;
            appFactory.update($scope,function(scope){
              scope.uData.myWall.unshift(data);
            });
          });
        });

      });//user profile
    };// init
  }// controller function


]);

//app.module('main').requires.push('userProfile');