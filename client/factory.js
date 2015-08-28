angular.module('main')

.factory('appFactory', function(){
  var obj = {};


  var genres = ['Classical', 'Jazz', 'Pop', 'Rock', 'Blues', 'Folk', 'Country', 'Electronic', 'Experimental'];
  obj.genres = genres.reduce(function(array, genre){
    array.push( {name: genre, selected: false} );
    return array;
  }, []);

  obj.chosenGenres = [];

  obj.chooseGenre = function(genre){
    genre.selected = !genre.selected;

    if (genre.selected){
      obj.chosenGenres.push(genre);
    } else {
      var indexOfGenre = obj.chosenGenres.indexOf(genre);
      obj.chosenGenres.splice(indexOfGenre, 1);
    }
    console.log("obj.chosenGenres = ", JSON.stringify(obj.chosenGenres));
  };


  return obj;
});
