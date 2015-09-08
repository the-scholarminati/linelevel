angular.module('main').controller('editEventController',['$scope','$http', 'appFactory', '$rootScope',
  function($scope,$http,appFactory){

  var ref = appFactory.firebase;
  var user = ref.getAuth();

  // this is the list of the user's chosen genres
  $scope.chosenGenres = appFactory.chosenGenres;
  $scope.chooseGenre = appFactory.chooseGenre;

  var init = function(){
      // load event data
      ref.child("events").child($scope.eventId)
        .on("value",function(info){ 
          var eventData = info.val();
          console.log(eventData);
          $scope.eventTitle = eventData.title;
          $scope.eventDescription = eventData.description;
          $scope.eventImage = eventData.image;
          $scope.eventLabel = eventData.label;
          var time = eventData.date;
          time = new Date(time);
          console.log(time);
        });
        
    };



  $scope.isAuth = function(){
    return user !== null;
  };

  init();

}]);