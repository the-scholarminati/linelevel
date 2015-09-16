//attaching controllers to main until we find reason to create specific modules


angular.module('main').controller('eventController',['$scope','$http', 'appFactory', '$state',
  function($scope, $http, appFactory, $state){

    $scope.event = {};
    $scope.event.messages = [];
    $scope.event.hostMessages = [];
    $scope.event.private = true;
    $scope.event.allowedUsers = {};
    $scope.event.showEvent = false;
    $scope.participants = {};
    $scope.adminTabMessage = '';
    $scope.invitedUser = '';

    // variables affecting app UI
    $scope.userText = '';
    $scope.chatVisible = true;
    $scope.isSameUser = false;
    $scope.showCountDown = true;
    $scope.initialized = false;
    $scope.selectedChat = [1,0,0];
    $scope.countDown = 'loading...';
    var elementsLoaded = false;

    // these variables will get updated if user is allowed to view the event
    var chatEl     = '';
    var hostChatEl = '';
    var chatAlert = '';

    // variables for live streaming
    var alertActivated = false;
    var streamActivated = false;

    //instantiate firbase ref with url
    var ref = appFactory.firebase;
    var userAuth = ref.getAuth();
    var userData = '';
    var chatRef = '';
    var eventRef = ref.child("events").child($scope.eventId);
    var usernamesRef = ref.child("usernames");
    var users = ref.child("users");

    // testing
    window.data = function(){
      console.log('private:', $scope.event.private);
      console.log('showEvent:', $scope.event.showEvent);
      console.log('appFactory.user', appFactory.user);
      console.log('userData.username ', userData.username);
      console.log('allowedUsers', $scope.event.allowedUsers);
      console.log('scope.initialized', $scope.initialized);
      console.log('chatEl', chatEl);
      console.log('hostChatEl', hostChatEl);
      console.log('userData is ', userData);
    };

    // private events - show page if host else check if user is allowed in event
    $scope.showEvent = function(){
      if($scope.isSameUser || !$scope.event.private){
        $scope.event.showEvent = true;
      } else {
        if($scope.event.followersOnly){
          appFactory.accessUserByUsername($scope.event.host,function(user){
            user = user.val();
            if(user.followers[userAuth.uid] !== undefined){
              appFactory.update($scope,function(scope){
                scope.event.showEvent = true;
              });
            }
          });
        } else {
          if($scope.event.allowedUsers[userData.username]){
            appFactory.update($scope,function(scope){
              scope.event.showEvent = true;
            });
          }
        }
      }
      return false;
    };

    $scope.eventStatus = function(){
      if($scope.event.private){
        return "This event is private";
      } else {
        return "This event is public";
      }
    };

    $scope.addToWhiteList = function(){
      var user = this.invitedUser.replace(/[\#\$\[\]\.]/g,'');
      if(user.length === 0){
        return;
      }
      if ($scope.event.allowedUsers[user]){
        appFactory.update($scope,function(scope){
          scope.adminTabMessage = 'Username "' + user + '" is already invited';
        });
      } else {
        usernamesRef.child(user).on("value",function(info){
          var data = info.val();
          if(data === null){
            appFactory.update($scope,function(scope){
              scope.adminTabMessage = 'Username "' + user + '" does not exist';
            });
          } else {
            eventRef.child("allowedUsers").child(info.key()).set(true);
            users.child(data.uid).child("notifications").push().set({
              message: "You have been added to event '" + $scope.event.name + "' by " + $scope.event.host, 
              status: 'unread',
              eventStart: $scope.event.date,
              received: (new Date()).getTime()
            });
            appFactory.update($scope,function(scope){
              scope.adminTabMessage = 'Invitation sent to ' + user;
            });
          }
          usernamesRef.off();
        });
      }
      this.invitedUser = '';
    };

    $scope.removeUserFromWhiteList = function(username){
      appFactory.accessUidByUsername(username,function(uid){
        users.child(uid).child("notifications").push().set({
          message: "You have been removed from event '" + $scope.event.name + "'",
          status: 'unread',
          received : (new Date()).getTime() 
        });
      });
      eventRef.child("allowedUsers").child(username).remove();
      delete $scope.event.allowedUsers[username];
    };


    // helper functions for participant list
    var updateParticipant = function(){
      appFactory.updateEventParticipation($scope);
      appFactory.timers.participantCounter = setTimeout(updateParticipant, 20000);
    };


    $scope.showParticipant = function(input){
      return input > (new Date()).getTime() - 40000;
    };
    

    // load user data
    if(userAuth){
      var userRef = ref.child("users").child(userAuth.uid);

      // save user data to local variable
      userRef.on("value",function(user){
        userData = user.val();
      });

      // store last entered session
      userRef.update({
        lastSessionId: $scope.eventId
      });
    }

    // load event data
    eventRef.on("value",function(info){ 
      var eventData = info.val();
      console.log(eventData);
      appFactory.update($scope,function(scope){
        $scope.event.host = eventData.host;
        $scope.event.name = eventData.title;
        $scope.event.videoId = eventData.videoId;
        $scope.event.genres = eventData.genre;
        $scope.event.date = eventData.date;
        $scope.event.private = eventData.private;
        $scope.event.followersOnly = eventData.followersOnly;
        $scope.isSameUser = userData.username === $scope.event.host || $scope.event.host === appFactory.user ? true : false;
      });
      //eventRef.off();
    });

    eventRef.child("allowedUsers").on("child_added",function(a){
      appFactory.update($scope,function(scope){
        scope.event.allowedUsers[a.key()] = a.val();
      });
    });

    var loadElements = function(){
      chatEl     = document.getElementById('chatMessages');
      hostChatEl = document.getElementById('hostMessages');
      chatAlert  = document.createElement('audio');
      chatAlert.setAttribute('src','../../assets/alert.wav');
      if(chatEl === null || hostChatEl === null){
        setTimeout(loadElements,30);
      } else {
        elementsLoaded = true;
      }
    };

    var updateSameUserStatus = function(){
      appFactory.update($scope,function(scope){
        scope.isSameUser = userData.username === scope.event.host || scope.event.host === appFactory.user ? true : false;
        console.log('is same user = ', scope.isSameUser);
      });
      if(userData.username === undefined){
        setTimeout(updateSameUserStatus,300);
      }
    };
    
    // initialize controller
    var init = function(){
      if(!$scope.initialized){
        updateSameUserStatus();
        //reset any previous firebase listeners
        ref.off();

        // delay the activation of chat alerts
        setTimeout(function(){alertActivated = true;},1500);

        // set up listeners for participants list
        eventRef.child("participants").on("child_added",function(user){
          appFactory.update($scope,function(scope){
            scope.participants[user.key()] = user.val().lastKnownTime;
          });
        });

        eventRef.child("participants").on("child_changed",function(user){
          appFactory.update($scope,function(scope){
            scope.participants[user.key()] = user.val().lastKnownTime;
          });
        });

        eventRef.child("participants").on("child_removed",function(user){
          appFactory.update($scope,function(scope){
            delete scope.participants[user.key()];
          });
        });

        eventRef.child('videoId').on('value', function(snapshot){
          console.log('videoId listener', snapshot.val());
          $scope.event.videoId = snapshot.val().videoId;
          setTimeout(function(){
            if($scope.isSameUser !== true){
              $scope.loadStream();
              console.log('loading stream for videoId', $scope.event.videoId);
            }
          }, 2000);
        });

        // load chat data and set chat listener
        chatRef = ref.child("chats").child($scope.eventId);
        chatRef.limitToLast(50).on('child_added', function(message){
          message = message.val();
          appFactory.update($scope,function(scope){
            scope.event.messages.push(message);
            if(alertActivated && userData.username !== message.username){
              chatAlert.play();
            }
            if(message.username === scope.event.host){
              scope.event.hostMessages.push(message);
            }
          });
        });


        $scope.initialized = true;
      }// end of if
    };

    // run init only if event is to be show to user - private event implementation
    $scope.$watch(function(scope){return $scope.event.showEvent;},function(nv,ov){
      if(nv){
        init();
        loadElements();
      }
    });

    // only run timers once the initialized function is run
    $scope.$watch(
      function(scope){
        return scope.initialized;
      },
      function(nv,ov){
      // auto scroll down in chat
        if(nv){
          //clearTimeout(appFactory.timers.eventCounter);
          appFactory.resetTimers();
          updateCountDown();
          updateParticipant();

          $scope.$watch(function(scope){return scope.event.messages.length;},function(a,b){
            if(elementsLoaded){
              $scope.scrollToBottom();
            }
          });
        }// end of if
      }// end of second watch function
    );

    // helper function for event countdown
    var updateCountDown = function(){
      var current = (new Date()).getTime();
      var message = "Updating...";

      // modify message
      if(current > $scope.event.date && $scope.event.date !== undefined){
        message = "Event ended on " + new Date($scope.event.date).toDateString();
      } else if ($scope.event.date !== undefined){
        var timeLeft = $scope.event.date - current;
        var days = Math.floor(timeLeft / 86400000);
        timeLeft = timeLeft % 86400000;
        var hours = Math.floor(timeLeft / 3600000);
        timeLeft = timeLeft % 3600000;
        var minutes = Math.floor(timeLeft / 60000);
        timeLeft = Math.floor(timeLeft % 60000 / 1000);

        days = days > 0 ? days === 1 ? days + " day " : days + " days " : "";
        hours = hours > 0 ? hours === 1 ? hours + " hour " : hours + " hours " : "";
        minutes = minutes > 0 ? minutes === 1 ? minutes + " minute " : minutes + " minutes and " : "";
        timeLeft = timeLeft === 1 ? timeLeft + " second" : timeLeft + " seconds";
        message = "Event begins in " + days + hours + minutes + timeLeft;
      }

      // update counter
      appFactory.update($scope,function(scope){
        scope.countDown = message;
      });

      appFactory.timers.eventCounter = setTimeout(updateCountDown, 1000);
    };

    var hideCountDown = function(){
      if(!streamActivated){
        streamActivated = true;
        appFactory.update($scope,function(scope){
          scope.showCountDown = false;
        });
      }
    };


    // ensures chat is scrolled to the bottom when new message is added
    $scope.scrollToBottom = function(){
      setTimeout(function(){
        chatEl.scrollTop = chatEl.scrollHeight;
        hostChatEl.scrollTop = hostChatEl.scrollHeight;
      },30);
    };

    $scope.isHost = function(input){
      return $scope.event.host === input.username;
    };

    $scope.isUser = function(input){
      return userData.username === input.username;
    };

    $scope.selectTab = function(num){
      $scope.selectedChat = [0,0];
      $scope.selectedChat[num] = 1;
      $scope.scrollToBottom();
    };

    // functions to calculate time
    $scope.chatTime = function(time){
      var gap = new Date() - new Date(time);
      var prefix = '';
      var days = Math.floor(gap / 86400000);
      
      if(days > 0){
        switch(days){
          case 1: prefix += "1 day ago";
                  break;
          default: prefix += days + " days ago";
        }
        return prefix;
      } else {
        var hours = Math.floor(gap / 3600000);
        var minutes = Math.floor(gap / 60000);
        if(hours){
          if (hours === 1){
            return 'an hour ago';
          }
          return '' + hours + ' hours ago';
        } else {
          if(minutes === 1){
            return 'a minute ago';
          } else if (minutes > 1){
            return minutes + ' minutes ago';
          } else {
            return 'less than a minute ago';
          }
        }
      }
    };

    $scope.sendMessage = function(){
      var text = this.userText;
      if(userData && $scope.initialized && text.length > 0){
        chatRef.push({username: userData.username, message: text, timestamp: (new Date()).getTime()});
      } else {
        $scope.event.messages.push({username:"Linelevel Bot", message: "Please log in to participate in chat!"});
      }
      this.userText = '';
    };

    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////
    CODE FOR LIVE STREAMING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    // $scope.$watch('$scope.event.videoId', function loadVideo(a,b){
    //   if($scope.isSameUser !== true){
    //     $scope.loadStream();
    //   }
    // });

    

    $scope.startStream = function(){
      hideCountDown();
      var peer = new Peer({key: '66p1hdx8j2lnmi',
                          debug: 3,
                          config: {'iceServers': [
                          {url: 'stun:stun.l.google.com:19302'},
                          {url: 'stun:stun1.l.google.com:19302'}
                          ]}
                        });

      peer.on('open', function(){
        ref.child("events").child($scope.eventId).update({'videoId' : peer.id});
        console.log(peer.id);

      });

      peer.on( 'connection', function(conn) {
        conn.on( 'open', function() {
          var call = peer.call(conn.peer, window.localStream);
        });
      });
      
      navigator.getUserMedia = ( navigator.getUserMedia ||
                              navigator.webkitGetUserMedia  ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia );

      // get audio/video
      navigator.getUserMedia({audio:true, video: true}, function (stream) {
          //display video
          var video = document.getElementById("myVideo");
          console.log(URL.createObjectURL(stream));
          video.src = URL.createObjectURL(stream);
          video.muted = false;
          console.log(stream.getAudioTracks()[0]);
          window.localStream = stream;
        },
        function (error) { console.log(error); }
      );

    };

    $scope.loadStream = function(){
      var peer = new Peer({key: '66p1hdx8j2lnmi'});
      console.log('video id ' + $scope.event.videoId);

      var conn = peer.connect($scope.event.videoId);

      peer.on('call', function (incomingCall) {
        hideCountDown();
        incomingCall.answer(null);
        incomingCall.on('stream', function(stream){
          var video = document.getElementById("theirVideo");
          console.log('create object url' + URL.createObjectURL(stream));
          video.src = URL.createObjectURL(stream);
          video.muted = false;
          console.log(stream.getAudioTracks());
        });
      });
    };

    $scope.stopStream = function(){
      if(window.localStream){
        window.localStream.stop();
      }else{
        console.log("You must be streaming to stop a stream!");
      }
      
    };

    $scope.$watch('$scope.event.videoId', function loadVideo(a,b){
      if($scope.isSameUser !== true){
        $scope.loadStream();
      }
    });

    $scope.editEvent = function(){
      $state.go('editevent', {eventId: $scope.eventId});
    };





//app.module('main').requires.push('event');

    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////
    CODE FOR VIDEO SETTINGS
    /////////////////////////////////////////////////////////////////////////////////////////////////////////*/

    $scope.play = function(){
      var peer = new Peer({key: '66p1hdx8j2lnmi'});
      console.log('video id ' + $scope.event.videoId);

      var conn = peer.connect($scope.event.videoId);

      peer.on('call', function (incomingCall) {
        hideCountDown();
        incomingCall.answer(null);
        incomingCall.on('stream', function(stream){
          var video = document.getElementById("theirVideo");
          console.log('create object url' + URL.createObjectURL(stream));
          video.src = URL.createObjectURL(stream);
          video.muted = false;
          console.log(stream.getAudioTracks());
        });
      });
    };

    $scope.stop = function(isAdmin){
      if(isAdmin){
        window.localStream.stop();
      }else{
        document.getElementById('theirVideo').pause();
      }
    };

    $scope.volumeUp = function(){
      if(document.getElementById('theirVideo').volume <1){
        document.getElementById('theirVideo').volume+=0.1;
      }
    };

    $scope.volumeDown = function(){
      if(document.getElementById('theirVideo').volume > 0){
        document.getElementById('theirVideo').volume-=0.1;
      }
    };

    $scope.mute = function(){
      document.getElementById('theirVideo').muted = !document.getElementById('theirVideo').muted;
    };

    $scope.toggleChat = function(){
      // console.log($scope.chatVisible);
      $scope.chatVisible = !$scope.chatVisible;
    };

    $scope.people = function(){
      if(document.getElementsByClassName('chat-participants')[0].style.visibility==="hidden"){
        document.getElementsByClassName('chat-participants')[0].style.visibility="visible";
      }else{
        document.getElementsByClassName('chat-participants')[0].style.visibility='hidden';
      }
    };

 }
]);