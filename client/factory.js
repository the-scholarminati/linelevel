angular.module('main')

.factory('appFactory', function($http){
  var obj = {};


  ///////////////
  ///// Misc
  ///////////////

  obj.firebase = new Firebase('https://linelevel.firebaseio.com');

  // resets timer on the event page count down when loading an event
  obj.timers = {
    eventCounter: null
  };


  ///////////////
  ///// Authentication
  ///////////////

  obj.auth = function(){
    return this.firebase.getAuth() !== null;
  };

  obj.unauth = function(){
    this.firebase.unauth();
  };

  obj.update = function(scope,cb){
    if(!scope.$$phase){
      scope.$apply(function(){
        cb.call(this,scope);
      });
    } else {
      cb.call(this,scope);
    }
  };


  ///////////////
  ///// HTTP
  ///////////////

  obj.startStream = function(token){
    return $http({
      method:'POST',
      url: 'https://www.googleapis.com/youtube/v3/liveStreams?part=snippet&access_token='+token
      }).then(function(response){
        console.log(response);
        return response;
    }, function(error){console.log(error);});
  };


  ///////////////
  ///// Genres
  ///////////////

  var genres = ['Classical', 'Jazz', 'Pop', 'Rock', 'Blues', 'Folk', 'Country', 'Electronic', 'Experimental'];
  obj.genres = genres.reduce(function(array, genre){
    array.push( {name: genre, selected: false} );
    return array;
  }, []);

  obj.chosenGenres = [];

  obj.chooseGenre = function(genre){
    // toggles whether the genre is selected or not
    genre.selected = !genre.selected;

    // adds or removes the genre from the user's chosen genre list as needed
    if (genre.selected){
      obj.chosenGenres.push(genre.name);
    } else {
      var indexOfGenre = obj.chosenGenres.indexOf(genre.name);
      obj.chosenGenres.splice(indexOfGenre, 1);
    }
  };
  

  obj.resetGenres = function(){
    // clears the user's selected genres from factory
    obj.chosenGenres = [];

    // clears selected class from all genres
    obj.genres.forEach(function(genre){
      genre.selected = false;
    });
  };


  ///////////////
  ///// Dates
  ///////////////

  obj.date = {};

  // sets the default time for creating a new event to today at 7pm
  obj.resetDate = function(){
    obj.date.eventDate = new Date();
    obj.date.eventDate.setHours(19);
    obj.date.eventDate.setMinutes(0);
    obj.date.eventDate.setSeconds(0);
    obj.date.eventDate.setMilliseconds(0);
  };


  ///////////////
  ///// Filter
  ///////////////

  obj.dateFilter = function(date, dateView){
    // show determines whether the event will be present after it has been run through the filter
    var show = true;

    // compare now + 1 hour to event date to see if the event has already passed
    var now = new Date();
    var isInFuture = now.getTime() + (60*60*1000) < date;

    // if the user wants to see future events
    if (dateView.futureView){
      show = isInFuture;
    // if the user wants to see past events
    } else if (dateView.pastView){
      show = !isInFuture;
    // if the user has selected a custom date range
    } else if (dateView.start && dateView.end){
      var start = dateView.start.getTime()
      var end = dateView.end.getTime()
      show = date >= start && date <= end;
    }
    return show;
  };


  obj.genreFilter = function(eventGenres, chosenGenres){
    // show determines whether the event will be present after it has been run through the filter
    var show = true;

    chosenGenres.forEach(function(genre){
      if (!eventGenres || eventGenres.indexOf(genre) === -1){
        show = false;
      }
    });

    return show;
  };


  obj.textFilter = function(eventText, filterText){
    // show determines whether the event will be present after it has been run through the filter
    var show = true;

    filterText = filterText.toLowerCase();

    if (eventText){
      eventText = eventText.toLowerCase();
      if ( eventText.indexOf(filterText) === -1 ){
        show = false;
      }
    } else {
      show = false;
    }

    return show;
  };


  return obj;
});
