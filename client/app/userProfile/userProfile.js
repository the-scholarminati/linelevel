//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){

    appFactory.init($scope);
    $scope.myProfile = null;
    $scope.loadPage = false;
    $scope.editingMessage = false;
    $scope.following = [];
    $scope.myFollowing = [];
    $scope.uData = {};
    $scope.followMessage = '';
    var ref = appFactory.firebase;
    var userAuth = ref.getAuth();
    var selfRef = null;
    var userRef = ref.child("usernames").child($scope.userName);
    var timerLimit = 10;

    if(userAuth !== null){
      ref.child("users").child(userAuth.uid);
    }

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



    $scope.canEdit = function(name){
      //console.log($scope.checkSameUserMsg(name) || $scope.myProfile);
      return $scope.checkSameUserMsg(name) || $scope.myProfile;
    };

    var initFollowMessage = function(){
      var message = '';
      // if myFollowing is not an array, then it was instantiated because it is not my profile
      if(!$scope.myProfile){
        if($scope.myFollowing[$scope.userName]){
          message = 'Unfollow';
        } else {
          message = 'Follow';
        }
      }
      appFactory.update($scope,function(scope){
        scope.followMessage = message;
      });
      if(timerLimit >= 0){
        timerLimit--;
        appFactory.timers.followButton = setTimeout(initFollowMessage,30);
      }
    };


    var init = function(){
      console.log("running init");
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
            data.key = snap.key();
            data.image = info.image || '../assets/profile.jpg';
            data.fullname = info.firstname + ' ' + info.lastname;
            data.canEdit = info.username === appFactory.userName;
            appFactory.update($scope,function(scope){
              scope.uData.myWall.push(data);
            });
          });
        });


      });//user profile
    };// init

   
    // change load page to true if authenticated
    // initialize if load page is true and profile is not empty
    var watch = function(){
      if(appFactory.userName === null){
        setTimeout(watch,30);
      } else {
        $scope.myProfile = appFactory.userName === $scope.userName;
        init();
      }
    };

    if(appFactory.auth()){
      ref.off();
      $scope.loadPage = true;
      watch();
    }

    // ensures that myProfile variable is always updated

    $scope.submitWallMsg = function(){
      var text = $scope.wallText;
      if(!text.length){ return;}

      appFactory.accessUserByUid(ref.getAuth().uid, function(snap){
        userRef.on("value",function(userData){
          userRef.off();
          ref.child('users').child(userData.val().uid).child('wall').push({
            username: snap.val().username, 
            message: text,
            timestamp: (new Date()).getTime()
          });
        });
        $scope.wallText = '';
      });
    };

    $scope.submitEditWallMsg = function(messageID, message){
      ref.child("usernames").child($scope.userName).on("value", function(userData){
        ref.child('users').child(userData.val().uid).child('wall').child(messageID).update({message: message});
        appFactory.update($scope,function(){
        });
      });
    };

    $scope.deleteWallMsg = function(messageID,msg){
      ref.child("usernames").child($scope.userName).on("value", function(userData){
        ref.child('users').child(userData.val().uid).child('wall').child(messageID).remove(function(error){
        });
      });
      var index = $scope.uData.myWall.indexOf(msg);
      $scope.uData.myWall.splice(index, 1);
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

    $scope.removeEvent = function(key){
      delete $scope.uData.myEvents[0][key];
      appFactory.accessUserByUid(ref.getAuth().uid, function(snap){
        userRef.on("value",function(userData){
          ref.child('users').child(userData.val().uid).child('currentEvents')
          .child(key).remove();
        });
      });
    };


    //assign current logged in user to variable for msg toolbar
    userRef.on("value",function(a){
      $scope.currentUser=a.val().username;
      userRef.off();
    });
  }


]).directive('editBar',function(){
  return {
    link: function(scope, element, attribute){
      element.on("mouseover", function(event){
        element[0].children[0].style.opacity=1;
      });
      element.on("mouseleave", function(event){
        element[0].children[0].style.opacity=0;
      });   
    }
  };
}).directive('editMsg', function(){
  return{
    link: function(scope, element, attribute){
      element.on('click', function(event){
        element[0].parentNode.parentNode.parentNode.children[2].style.display = 'initial';
        element[0].parentNode.parentNode.parentNode.children[3].style.display = 'none';
      });
    }
  };
});

//app.module('main').requires.push('userProfile');