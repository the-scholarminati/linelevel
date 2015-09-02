//attaching controllers to main until we find reason to create specific modules

angular.module('main').controller('eventController',['$scope','$http','appFactory',
  function($scope,$http, appFactory){

    console.log("Loading event page...");
    $scope.chatVisible = true;
    $scope.event = {};
    $scope.event.host = "Anonymous";
    $scope.event.name = 'Sample Event';
    $scope.event.messages = [];

    //instantiate firbase ref with url
    var ref = appFactory.firebase;

    //through auth have user name on hand
    $scope.username = "Anonymous";
    var username = $scope.username;

    //ref.on() -- get chatId from event session
    var chatRef = ref.child('chats'); //insert chat id info here

    //fetch chat data as you add to it, returns last 20
    chatRef.limitToLast(20).on('child_added', function(snapshot){
        var data = snapshot.val();
        $scope.event.messages.push(data);
        console.log(data);
    });
                          
    $scope.sendMessage = function(){
        var text = $scope.userText;
        console.log(text);
        chatRef.push({username: username, message: text});
        $scope.userText = '';
    };

    $scope.toggleChat = function(){
      console.log($scope.chatVisible);
      $scope.chatVisible = !$scope.chatVisible;
    };

    $scope.startStream = function(){
      appFactory.startStream($scope.accessToken);
    };

  $scope.auth = function(){
        var config = {
          'client_id': '43388747005-isrtg2iv8558roqeakpu536dta5i8p71.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload'
        };
        gapi.auth.authorize(config, function() {
          console.log('login complete');
          console.log(gapi.auth.getToken());
          $scope.getUserChannel();
        });
      };

  $scope.getUserChannel = function(){
    gapi.client.load('youtube', 'v3').then(function(){


      var request = gapi.client.youtube.channels.list({
          part: 'id',
          mine: true
          
      });
      
      request.then(function(response) {
        $scope.channelName = response.result.items[0].id;
        console.log($scope.channelName);
        $scope.getVideo();
      }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
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
          $scope.processResult(response);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
        

      };
      
  $scope.processResult = function(result){
        
        console.log(result);
        
        var json = JSON.parse(result.body);
        if(json.pageInfo.totalResults === 0){
            // DO SOMETHING
        } else {
        $scope.videoId = json.items[0].id.videoId;
        $scope.placeVideo();    
        console.log($scope.videoId);
        }
        
      };


      $scope.onPlayerReady = function(event) {
        event.target.playVideo();
      };

      $scope.placeVideo = function(){
        console.log('placing video')
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByClassName('video')[0];
        $('.video').append(tag);

        // Replace the 'ytplayer' element with an <iframe> and
        // YouTube player after the API code downloads.
        var player;
        function loadPlayer() {
          player = new YT.Player('ytplayer', {
            height: '390',
            width: '640',
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