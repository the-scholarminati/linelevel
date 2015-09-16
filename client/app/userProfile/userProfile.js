//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){

    appFactory.init($scope);
    $scope.isAuth = appFactory.auth;
    $scope.myProfile = null;
    $scope.loadPage = false;
    $scope.editingMessage = false;
    $scope.following = [];
    $scope.myFollowing = [];
    $scope.uData = {};
    $scope.followMessage = '';
    $scope.myUserName = '';
    var ref = appFactory.firebase;
    var timerLimit = 10;

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

    var getMyUsername = function(cb){
      var called = false;
      return function(){
        if(!called){
          called = true;
          var userRef = ref.child("users").child(ref.getAuth().uid);
          userRef.on("value",function(a){
            a=a.val();
            userRef.off();
            cb.apply(this,[a.username]);
          });
        }
      };
    };

    $scope.checkSameUserMsg = function(name){
        return (appFactory.user === name || $scope.currentUser === name); 
    };

    $scope.checkSameUserPage = function(){
        return (appFactory.user === $scope.uData.username || $scope.currentUser === $scope.uData.username);
    };

    $scope.canEdit = function(name){
      return $scope.checkSameUserMsg(name) || $scope.checkSameUserPage();
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

    // change load page to true if authenticated
    var watch1 = $scope.$watch(function(scope){
      getMyUsername(function(username){
        appFactory.update(scope,function(x){
          x.myUsername = username;
        });
      })();
      return scope.isAuth();},function(nv,ov){
      if(nv){
        $scope.loadPage = true;
        ref.off();
      }
    });

    // ensures that myProfile variable is always updated
    var watch2 = $scope.$watch(function(scope){
      var x = scope.userName;
      var y = scope.myUsername;
      return x === y;
    },function(nv,ov){
      var outcome;
      if(nv){
        outcome = true;
        // watch2();
      } else {
        outcome = false;
      }
      appFactory.update($scope,function(scope){
        scope.myProfile = outcome;
      });
    });
    
    // initialize if load page is true and profile is not empty
    var watch3 = $scope.$watch(function(){return $scope.loadPage;}, function(nv,ov){
      if(nv && $scope.myProfile !== null){
        init();
        // watch3();
        watch1();
      }
    });

   

    $scope.submitWallMsg = function(){
      var text = $scope.wallText;
      if(!text.length){ return;}

      appFactory.accessUserByUid(ref.getAuth().uid, function(snap){
        var userRef = ref.child("usernames").child($scope.userName);
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
      var index = $scope.uData.myWall.indexOf(msg);
      $scope.uData.myWall.splice(index, 1);
      ref.child("usernames").child($scope.userName).on("value", function(userData){
        ref.child('users').child(userData.val().uid).child('wall').child(messageID).remove(function(error){
        });
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
            data.key = snap.key();
            data.image = info.image || '../assets/profile.jpg';
            data.fullname = info.firstname + ' ' + info.lastname;
            appFactory.update($scope,function(scope){
              scope.uData.myWall.push(data);
            });
          });
        });


      });//user profile
    };// init

    //assign current logged in user to variable for msg toolbar
    var userRef = ref.child("users").child(ref.getAuth().uid);
      userRef.on("value",function(a){
      $scope.currentUser=a.val().username;
      appFactory.user = a.val().username;
      console.log('the current user', $scope.currentUser);
    });

  }// controller function


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