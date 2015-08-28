//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('createEventController', ['$scope', 
  function($scope){

    // move to a factory/service so it can be used by users when they're creating their profile as well
    var genres = ['Classical', 'Jazz', 'Pop', 'Rock', 'Blues', 'Folk', 'Country', 'Electronic', 'Experimental'];
    $scope.genres = genres.reduce(function(array, genre){
      array.push( {name: genre, selected: false} );
      return array;
    }, []);

    $scope.chosenGenres = [];
    $scope.chooseGenre = function(genre){
      genre.selected = !genre.selected;

      if (genre.selected){
        $scope.chosenGenres.push(genre);
      } else {
        var indexOfGenre = $scope.chosenGenres.indexOf(genre);
        $scope.chosenGenres.splice(indexOfGenre, 1);
      }
      console.log("$scope.chosenGenres = ", JSON.stringify($scope.chosenGenres));
    };

    $scope.submitCreateEventForm = function(){
      // push event data to the database

      // the image url is not required on the form
      // maybe have a stand-in image that is used for events that don't have this field

      // console log to test the button is functioning
      console.log("event creation form submitted!");
    };

  }
]);


//app.module('main').requires.push('createEvent');