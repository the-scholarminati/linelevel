//attaching controllers to main until we find reason to create specific modules

angular.module('main').controller('eventController',['$scope','$http', 'appFactory', '$rootScope',
  function($scope,$http,appFactory){
    $scope.videoId = 'dQw4w9WgXcQ';

    // console.log("Loading event page...");
    $scope.chatVisible = true;
    $scope.event = {};
    $scope.event.messages = [];
    $scope.isSameUser = false;
    var chatEl = document.getElementById('chatMessages');

    // window.console.log('eventId', $scope.eventId);

    //instantiate firbase ref with url
    var initialized = false;
    var ref = appFactory.firebase;
    var userData = '';
    var chatRef = '';
    

    // initialize controller
    var init = function(){
      if(!initialized){
        initialized = !initialized;
        ref.off();

        // load event data
        ref.child("events").child($scope.eventId)
          .on("value",function(info){ 
            var eventData = info.val();
            console.log(eventData);
            $scope.event.host = eventData.host;
            $scope.event.name = eventData.title;
            $scope.event.videoId = eventData.videoId;
            $scope.isSameUser = appFactory.user === $scope.event.host ? true : false;
          console.log(appFactory.user +  $scope.event.host + $scope.isSameUser);
        });

        // load user data
        var userAuth = ref.getAuth();
        if(userAuth){
          window.console.log('userAuth is ', userAuth);
          ref.child("users").child(userAuth.uid).on("value",function(user){
            userData = user.val();
          });
        }

        // load chat data and set chat listener
        chatRef = ref.child("chats").child($scope.eventId);
        chatRef.on('child_added', function(message){
          message = message.val();
          appFactory.update($scope,function(scope){
            scope.event.messages.push(message);
            if(message.username === scope.event.host){
              scope.event.hostMessage = message;
            }
          });
        });

      }// end of if
    };
    init();


    $scope.sendMessage = function(){
      if(userData && initialized){
        var text = $scope.userText;
        chatRef.push({username: userData.username, message: text, timestamp: (new Date()).getTime()});
      } else {
        $scope.event.messages.push({username:"Linelevel Bot", message: "Please log in to participate in chat!"});
      }
      $scope.userText = '';
    };

    // auto scroll down in chat
    $scope.$watch(function(scope){
      return scope.event.messages.length;
    },function(a,b){
      setTimeout(function(){
        chatEl.scrollTop = chatEl.scrollHeight;
      },30);
    });

     $scope.startStream = function(){
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
        incomingCall.answer(null);
        incomingCall.on('stream', function(stream){
          var video = document.getElementById("theirVideo");
          console.log('create object url' + URL.createObjectURL(stream));
          video.src = URL.createObjectURL(stream);
        });
      });
    };
    $scope.$watch('$scope.event.videoId', function loadVideo(a,b){
      if($scope.isSameUser !== true){
        $scope.loadStream();
      }
    });


    $scope.toggleChat = function(){
      // console.log($scope.chatVisible);
      $scope.chatVisible = !$scope.chatVisible;
    };

  //  ------------------------YOUTUBE STUFF ----------------------
    // $scope.startStream = function(){
    //   appFactory.startStream($scope.accessToken);
    // };

    $scope.auth = function(){
      var config = {
        'client_id': '43388747005-isrtg2iv8558roqeakpu536dta5i8p71.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload'
      };
      gapi.auth.authorize(config, function() {
        // console.log('login complete');
        // console.log(gapi.auth.getToken());
        $scope.getUserChannel();
      });
    };

  $scope.getUserChannel = function(){
    gapi.client.load('youtube', 'v3').then(function(){

      var request = gapi.client.youtube.channels.list({
        part: 'id',
        mine: true

      });
    });
  };

    $scope.getVideo = function(){

      var request = gapi.client.youtube.search.list({
        part: 'snippet',
        channelId: $scope.channelName,
        maxResults: 1,
        type: 'video',
        eventType: 'live'
            
      });

      request.then(function(response) {
        $scope.channelName = response.result.items[0].id;
        // console.log($scope.channelName);
        $scope.getVideo();
      }, function(reason) {
        // console.log('Error: ' + reason.result.error.message);
      });
  };

  $scope.getVideo = function(){

    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      channelId: $scope.channelName,
      maxResults: 1,
      type: 'video',
      eventType: 'live'
    });

    request.then(function(response) {
      $scope.processResult(response);
    }, function(reason) {
      // console.log('Error: ' + reason.result.error.message);
    });


  };

  $scope.processResult = function(result){

    // console.log(result);

    var json = JSON.parse(result.body);
    if(json.pageInfo.totalResults === 0){
          // DO SOMETHING
        } else {
          $scope.videoId = json.items[0].id.videoId;
          $scope.placeVideo();    
          // console.log($scope.videoId);
        }

      };


      $scope.onPlayerReady = function(event) {
        event.target.playVideo();
      };

      $scope.placeVideo = function(){
        // console.log('placing video');
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByClassName('video')[0];
        $('.video').append(tag);

      // Replace the 'ytplayer' element with an <iframe> and
      // YouTube player after the API code downloads.
      var player;
      function loadPlayer() {
        player = new YT.Player('ytplayer', {
          height: '100%',
          width: '100%',
          videoId: $scope.videoId,
          events: {
            'onReady': $scope.onPlayerReady
          }
        });
      }

      setTimeout(loadPlayer,500);
    };

  }
  ]);

//app.module('main').requires.push('event');