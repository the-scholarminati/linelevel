//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('createEventController', ['$scope', 'appFactory', '$firebase','$state',
  function($scope, appFactory, $firebase, $state){
    appFactory.init($scope);
    // gets the current date so we can stop users from choosing dates in the past
    $scope.today = new Date();
    // gets the date from the factory and makes it accessible to the DOM
    $scope.date = appFactory.date;
    // sets the date to today and time to 7pm with no seconds
    appFactory.resetDate();

    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    // this is the list of the user's chosen genres
    $scope.chosenGenres = appFactory.chosenGenres;
    $scope.chooseGenre = appFactory.chooseGenre;
    $scope.private = false;
    $scope.followersOnly = true;

    var ref = appFactory.firebase;
    var user = ref.getAuth();

    $scope.isAuth = function(){
      return user !== null;
    };

    $scope.submitCreateEventForm = function(){
      // saves the data from the form
      var id = '';
      var eventTitle = $scope.eventTitle;
      var eventDescription = $scope.eventDescription;
      // the image url is not required on the form
      // maybe have a default image that is used when image is not provided
      var eventImage = $scope.eventImage || './assets/albumcover.png';
      var eventLabel = $scope.eventLabel || '';
      var eventDate = $scope.date.eventDate.getTime();
      console.log("eventDate = ", eventDate);
      var chosenGenres = $scope.chosenGenres;
      var privateEvent = $scope.private;
      var followersOnly = $scope.followersOnly;
      
      // save eventId to variable
      if(user){
        var userRef = ref.child("users").child(user.uid);
        userRef.on("value",function(userData){
          userData = userData.val();
          userRef.off();
          var username = userData.username;
          var eventId = ref.child('events').push();
          id = eventId.key();
          eventId.set({
            title: eventTitle,
            description: eventDescription,
            image: eventImage,
            label: eventLabel,
            date: eventDate,
            genre: chosenGenres,
            host: username,
            private: privateEvent,
            followersOnly: followersOnly
          });

          // send notification about new event to all followers
          for(var key in userData.followers){
            appFactory.sendNotification(key,{
              messageType:"Event",
              sender:"Linelevel Bot",
              startDate: eventDate,
              message: username + " has a new event!",
              url: ['event', eventId.key()]
            });
          }

          ref.child("chats").child(eventId.key()).push().set({
            username:"Linelevel Bot", 
            message:"chat created for event " + eventTitle,
            timestamp: (new Date()).getTime()
          });
        });

        // resets the form
        $scope.eventTitle = '';
        $scope.eventDescription = '';
        $scope.eventImage = '';
        $scope.eventLabel = '';
        appFactory.resetDate();
        appFactory.resetGenres();
        console.log("event creation form submitted!");
        console.log("id is ", id);
        $state.go('event',{eventId:id});
      } else {
        console.log("please log in to create an event");
      }

      // console log to test the button is functioning


      // TODO: push event data to the database


      // what happens after an event is successfully created? redirect to the user's profile?
    };

  }
]);
