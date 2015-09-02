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
  }

]);

//app.module('main').requires.push('event');