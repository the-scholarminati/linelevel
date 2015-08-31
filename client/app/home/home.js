//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('homeController', ['$scope', 'appFactory', 
  function($scope, appFactory){
    $scope.events = [];
    var ref = new Firebase("https://linelevel.firebaseio.com/");

    //reference events endpoint
    var eventsRef = ref.child("events");

    //fetch last 20 events
    eventsRef.limitToLast(20).on('child_added', function(snapshot){
      var data = snapshot.val();
      $scope.events.push(data);  //store data in events array
      console.log(data);
    });

    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    // this is the list of the user's chosen genres
    $scope.chosenGenres = appFactory.chosenGenres;
    $scope.chooseGenre = appFactory.chooseGenre;

    $scope.showGenres = false;

    $scope.showGenresNow = function(){
      $scope.showGenres = !$scope.showGenres;
    };

    $scope.filteredEvents = function(events){
      // only filter by genres if the user has chosen at least one genre
      if ($scope.chosenGenres.length){
        // show event if all of the genres associated with it are in the chosenGenres list
        return events.filter(function(event){
          var show = true;
          for (var i=0; i<$scope.chosenGenres.length; i++){
            if (event.genre.indexOf($scope.chosenGenres[i]) === -1){
              show = false;
            }
          }
          return show;
        });
      } else {
        return $scope.events;
      }
    };
  }
]);

//app.module('main').requires.push('home');