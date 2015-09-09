angular.module('main').controller('editEventController',['$scope','appFactory', '$firebase',
  function($scope,appFactory,$firebase){

  var ref = appFactory.firebase;
  var user = ref.getAuth();

  // this is the list of the user's chosen genres
  var genres = appFactory.genres;
<<<<<<< HEAD

=======
>>>>>>> Fixed autoselection of genres
  $scope.chosenGenres = appFactory.chosenGenres;
  $scope.chooseGenre = appFactory.chooseGenre;

  $scope.today = new Date();
  $scope.date = appFactory.date;

    // sets the date to today and time to 7pm with no seconds
  appFactory.resetDate();
  
 

  var init = function(){
      // load event data
      ref.child("events").child($scope.eventId)
        .on("value",function(info){

          var eventData = info.val();
          $scope.eventTitle = eventData.title;
          $scope.eventDescription = eventData.description;
          $scope.eventImage = eventData.image;
          $scope.eventLabel = eventData.label;
          $scope.genre = eventData.genre;

          if($scope.genre){
            $scope.genre.forEach(function(genre){
              $scope.chosenGenres.push(genre);
              genres.forEach(function(genres){
                if(genres.name === genre){
                  genres.selected = true;
                }
              });
            });
          }

          $scope.genres = genres;
          $scope.date.eventDate = new Date(eventData.date);
          // console.log($scope.genres);
          // console.log($scope.genre);
        });
        
    };

    $scope.saveChanges = function(){
      console.log('save changes invoked');
      $scope.eventTitle =this.eventTitle;
      var eventTitle = this.eventTitle;
      var eventDescription = this.eventDescription;

      // the image url is not required on the form
      // maybe have a default image that is used when image is not provided
      var eventImage = this.eventImage || './assets/albumcover.png';
      var eventLabel = this.eventLabel || '';
      var eventDate = $scope.date.eventDate.getTime();
      console.log(eventTitle);
      console.log(eventDescription);
      var chosenGenres = this.chosenGenres;
      console.log('chosen genres' + chosenGenres);


      ref.child("events").child($scope.eventId).update({
            'title': eventTitle,
            'description': eventDescription,
            'image': eventImage,
            'label': eventLabel,
            'date': eventDate,
            'genre': chosenGenres});
    };


  $scope.isAuth = function(){
    return user !== null;
  };

  init();

}]).directive('autofill', ['$timeout', function ($timeout) {
    return {
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            $timeout(function(){
                $(elem[0]).trigger('input');
                // elem.trigger('input'); try this if above don't work
            }, 200);
        }
    };
}]);
