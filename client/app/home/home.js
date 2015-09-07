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
      data.key = snapshot.key();
      appFactory.update($scope,function(){
        $scope.events.push(data);  
      });
    });


    ///////////////
    ///// Tab views
    ///////////////

    // these variables track which tab we're viewing
    // it is set to upcoming events by default
    $scope.futureView = true;
    $scope.pastView = false;
    $scope.customDateView = false;

    // this variable determines whether the events will be shown in descending order by date or not
    // we're showing the oldest first for future events and custom date range 
    // and we're showing the newest first for past events
    $scope.isReverse = false;

    // these are the click events for switching tabs
    $scope.viewFutureEvents = function(){
      if (!$scope.futureView){
        $scope.futureView = true;
        $scope.pastView = false;
        $scope.customDateView = false;
        $scope.isReverse = false;
      }
    };
    $scope.viewPastEvents = function(){
      if (!$scope.pastView){
        $scope.pastView = true;
        $scope.futureView = false;
        $scope.customDateView = false;
        $scope.isReverse = true;
      }
    };
    $scope.viewDateFilter = function(){
      if (!$scope.customDateView){
        $scope.customDateView = true;
        $scope.futureView = false;
        $scope.pastView = false;
        $scope.isReverse = false;
      }
    };


    ///////////////
    ///// Num limit
    ///////////////

    // this tracks the number of events that passed the filter
    $scope.eventsLength;

    // max number of events shown via ng-repeat
    // 20 is the default
    $scope.numLimit = 20;

    // user can increase number of events shown
    $scope.increaseNumLimit = function(){
      $scope.numLimit += 20;
    };

    // hide the 'Show More Events' button by default
    $scope.showMoreButton = false;


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


    ///////////////
    ///// Filter
    ///////////////

    // object to hold the dates on the custom date range tab
    $scope.dateRange = {};

    // this is the number of milliseconds that the text input filters will wait after a user stops typing to filter
    $scope.debounce = 200;

    $scope.filteredEvents = function(events){
      // reset the events length counter
      $scope.eventsLength = 0;

      return events.filter(function(event){
        // show determines whether the event will be present after it has been run through the filter
        var show = true;

        //////////////////////
        ///// Filter by Dates
        //////////////////////

        // compare now + 1 hour to event date to see if the event has already passed
        var now = new Date();
        var isInFuture = now.getTime() + (60*60*1000) < event.date;
        // if the user wants to see future events
        if ($scope.futureView){
          show = isInFuture;
        // if the user wants to see past events
        } else if ($scope.pastView){
          show = !isInFuture;
        // if the user has selected a custom date range
        } else if ($scope.dateRange.start && $scope.dateRange.end){
          var start = $scope.dateRange.start.getTime()
          var end = $scope.dateRange.end.getTime()
          show = event.date >= start && event.date <= end;
        }


        //////////////////////
        ///// Filter by Genres
        //////////////////////

        if (show && $scope.chosenGenres){
          $scope.chosenGenres.forEach(function(genre){
            if (!event.genre || event.genre.indexOf(genre) === -1){
              show = false;
            }
          });
        }


        //////////////////////
        ///// Filter by Titles
        //////////////////////

        if (show && $scope.filterByTitle){
          if ( event.title.toLowerCase().indexOf( $scope.filterByTitle.toLowerCase() ) === -1 ){
            show = false;
          }
        }


        //////////////////////
        ///// Filter by Users
        //////////////////////

        if (show && $scope.filterByUser){
          if ( !event.host || event.host.indexOf($scope.filterByUser) === -1 ){
            show = false;
          }
        }


        // increase event length counter if the event passed the filter
        if (show){$scope.eventsLength++;}

        // hide the 'Show More Events' button if there are no more events to show
        $scope.showMoreButton = $scope.eventsLength > $scope.numLimit;


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
