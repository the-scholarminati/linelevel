angular.module('main')

.factory('appFactory', function($http){
  var obj = {};


  obj.firebase = new Firebase('https://linelevel.firebaseio.com');


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


  obj.resetDate = function(){
    obj.date.eventDate = new Date();
    obj.date.eventDate.setHours(19);
    obj.date.eventDate.setMinutes(0);
    obj.date.eventDate.setSeconds(0);
    obj.date.eventDate.setMilliseconds(0);
  };


  return obj;
});
