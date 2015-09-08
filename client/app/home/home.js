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

    //fetch latest 200 events
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
    $scope.dateView = {};
    $scope.dateView.futureView = true;
    $scope.dateView.pastView = false;
    $scope.dateView.customDateView = false;

    // this variable determines whether the events will be shown in descending order by date or not
    // we're showing the oldest first for future events and custom date range 
    // and we're showing the newest first for past events
    $scope.isReverse = false;

    // these are the click events for switching tabs
    $scope.viewFutureEvents = function(){
      if (!$scope.dateView.futureView){
        $scope.dateView.futureView = true;
        $scope.dateView.pastView = false;
        $scope.dateView.customDateView = false;
        $scope.isReverse = false;
      }
    };
    $scope.viewPastEvents = function(){
      if (!$scope.dateView.pastView){
        $scope.dateView.pastView = true;
        $scope.dateView.futureView = false;
        $scope.dateView.customDateView = false;
        $scope.isReverse = true;
      }
    };
    $scope.viewDateFilter = function(){
      if (!$scope.dateView.customDateView){
        $scope.dateView.customDateView = true;
        $scope.dateView.futureView = false;
        $scope.dateView.pastView = false;
        $scope.isReverse = false;
      }
    };


    ///////////////
    ///// Number of events shown
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

    // this is the number of milliseconds that the text input filters will wait after a user stops typing to filter
    $scope.debounce = 200;

    // get the filter methods from the factory
    $scope.dateFilter = appFactory.dateFilter;
    $scope.genreFilter = appFactory.genreFilter
    $scope.textFilter = appFactory.textFilter

    $scope.filteredEvents = function(events){
      // reset the events length counter
      $scope.eventsLength = 0;

      return events.filter(function(event){
        // show determines whether the event will be present after it has been run through the filter

        // filter by date
        var show = $scope.dateFilter(event.date, $scope.dateView);

        // filter by genre
        if (show && $scope.chosenGenres){
          show = $scope.genreFilter(event.genre, $scope.chosenGenres);
        }

        // filter by title
        if (show && $scope.filterByTitle){
          show = $scope.textFilter(event.title, $scope.filterByTitle);
        }

        // filter by user
        if (show && $scope.filterByUser){
          show = $scope.textFilter(event.host, $scope.filterByUser);
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
