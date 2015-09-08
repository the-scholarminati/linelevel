angular.module('main').controller('editEventController',['$scope','$http', 'appFactory', '$rootScope',
  function($scope,$http,appFactory){

  var ref = appFactory.firebase;
  var user = ref.getAuth();

  // this is the list of the user's chosen genres
  $scope.genres = appFactory.genres;
  $scope.chosenGenres = appFactory.chosenGenres;
  $scope.chooseGenre = appFactory.chooseGenre;

  var init = function(){
      // load event data
      ref.child("events").child($scope.eventId)
        .on("value",function(info){
          $scope.date = {};
          var eventData = info.val();
          console.log(eventData);
          $scope.eventTitle = eventData.title;
          $scope.eventDescription = eventData.description;
          $scope.eventImage = eventData.image;
          $scope.eventLabel = eventData.label;
          $scope.genre = eventData.genre;
          var time = eventData.date;
          time = new Date(time);
          $scope.date.eventDate = time;
          console.log(time.getHours());
          console.log($scope.genres);
        });
        
    };



  $scope.isAuth = function(){
    return user !== null;
  };

  init();

}]);