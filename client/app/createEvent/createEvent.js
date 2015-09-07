//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('createEventController', ['$scope', 'appFactory', '$firebase',
  function($scope, appFactory, $firebase){
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

    var ref = appFactory.firebase;
    var user = ref.getAuth();

    $scope.isAuth = function(){
      return user !== null;
    };

    $scope.submitCreateEventForm = function(){
      // saves the data from the form
      var eventTitle = $scope.eventTitle;
      var eventDescription = $scope.eventDescription;
      // the image url is not required on the form
      // maybe have a default image that is used when image is not provided
      var eventImage = $scope.eventImage || './assets/albumcover.png';
      var eventLabel = $scope.eventLabel || '';
      var eventDate = $scope.date.eventDate.getTime();
      console.log("eventDate = ", eventDate);
      var chosenGenres = $scope.chosenGenres;
      
      // save eventId to variable
      if(user){
        ref.child("users").child(user.uid).on("value",function(userData){
          var username = userData.val().username;

          var eventId = ref.child('events').push();
          eventId.set({
            title: eventTitle,
            description: eventDescription,
            image: eventImage,
            label: eventLabel,
            date: eventDate,
            genre: chosenGenres,
            host: username
          });

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
      } else {
        console.log("please log in to create an event");
      }

      // console log to test the button is functioning


      // TODO: push event data to the database


      // what happens after an event is successfully created? redirect to the user's profile?
    };

  }
]);
