//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('homeController', ['$scope', 'appFactory', 
  function($scope, appFactory){
    ///////////////
    ///// Firebase
    ///////////////
    $scope.events = [];
    var ref = appFactory.firebase;

    //reference events endpoint
    var eventsRef = ref.child("events");

    //fetch last 20 events
    eventsRef.orderByChild('date').limitToLast(200).on('child_added', function(snapshot){
      var data = snapshot.val();
      // console.log("data = ", data);
      data.key = snapshot.key();
      appFactory.update($scope,function(){
        $scope.events.push(data);  
      });
    });


    ///////////////
    ///// Tab views
    ///////////////
    // this variable tracks if we're looking at upcoming or past events
    // it is set to upcoming events by default
    $scope.futureView = true;

    $scope.viewFutureEvents = function(){
      if (!$scope.futureView){
        $scope.futureView = true;
      }
    };

    $scope.viewPastEvents = function(){
      if ($scope.futureView){
        $scope.futureView = false;
      }
    };


    ///////////////
    ///// Num limit
    ///////////////
    // max number of events shown via ng-repeat
    // 20 is the default
    $scope.numLimit = 20;

    // user can increase number of events shown
    $scope.increaseNumLimit = function(){
      $scope.numLimit += 20;
    };

    // show the 'Show More Events' button by default
    $scope.showMoreButton = false;

    // hide the 'Show More Events' button if there are no more events to show
    // if ($scope.filtered.length <= $scope.numLimit){
    //   $scope.showMoreButton = false;
    // }


    ///////////////
    ///// Genres
    ///////////////
    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    // this is the list of the user's chosen genres
    $scope.chosenGenres = appFactory.chosenGenres;
    $scope.chooseGenre = appFactory.chooseGenre;

    // hides genre filter dropdown by default
    $scope.showGenres = false;
    // toggles genre filter dropdown view
    $scope.showGenresNow = function(){
      $scope.showGenres = !$scope.showGenres;
    };
    $scope.dateType = function(date){
      console.log(date);
    };


    ///////////////
    ///// Filter
    ///////////////
    // this is the number of milliseconds that the text input filters will wait after a user stops typing to filter
    $scope.debounce = 200;

    $scope.filteredEvents = function(events){
      // filter out which evens will be shown
      return events.filter(function(event){
        // show determines whether the event will be present after it has been run through the filter
        var show = true;

        // compare now + 1 hour to event date to see if the event has already passed
        var now = new Date();
        var isInFuture = now.getTime() + (60*60*1000) < event.date;
        // if the user wants to see future events
        if ($scope.futureView){
          // show the event if it's in the future
          show = isInFuture;
        // if the user wants to see past events
        } else {
          // show the event if it's not in the future
          show = !isInFuture;
        }

        // remove event if any of the genres chosen by the user are not in the event's genre list
        if (show && $scope.chosenGenres){
          $scope.chosenGenres.forEach(function(genre){
            if (!event.genre || event.genre.indexOf(genre) === -1){
              show = false;
            }
          });
        }

        // remove event if the title filter is not in the event's title
        if (show && $scope.filterByTitle){
          if ( event.title.toLowerCase().indexOf( $scope.filterByTitle.toLowerCase() ) === -1 ){
            console.log("$scope.filterByTitle = ", $scope.filterByTitle);
            show = false;
          }
        }

        // remove event if the user filter is not in the event's user
        if (show && $scope.filterByUser){
          if ( !event.host || event.host.indexOf($scope.filterByUser) === -1 ){
            show = false;
          }
        }

        return show;
      });
    };

  }
])
.directive('mouseOver', function(){
  return {
    link: function(scope, element, attr){
      element.on('mouseover', function(event){
        element[0].children[0].style.top = '0px';
        element[0].children[1].style.top = '0px';
        element[0].children[1].style.opacity= 0.80;
        element[0].children[1].style.filter= 'alpha(opacity=80)';
      });
      element.on('mouseleave', function(event){
        element[0].children[0].style.top = '125px';
        element[0].children[1].style.top = '125px';
        element[0].children[1].style.opacity= 0.50;
        element[0].children[1].style.filter= 'alpha(opacity=50)';
      });
    }
  };


});
