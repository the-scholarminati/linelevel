angular.module('main')

.factory('appFactory', function(){
  var obj = {};


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
      obj.chosenGenres.push(genre);
    } else {
      var indexOfGenre = obj.chosenGenres.indexOf(genre);
      obj.chosenGenres.splice(indexOfGenre, 1);
    }
    console.log("obj.chosenGenres = ", JSON.stringify(obj.chosenGenres));
  };


  obj.resetGenres = function(){
    obj.chosenGenres = [];

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
