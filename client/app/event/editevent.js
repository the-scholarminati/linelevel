angular.module('main').controller('editEventController',['$scope','appFactory', '$firebase', '$state',
  function($scope,appFactory,$firebase, $state){
  appFactory.init($scope);

  var ref = appFactory.firebase;
  var user = ref.getAuth();

  // this is the list of the user's chosen genres
  $scope.genres = appFactory.genres;
  $scope.chosenGenres = appFactory.chosenGenres;
  $scope.chooseGenre = appFactory.chooseGenre;

  $scope.today = new Date();
  $scope.date = appFactory.date;
  $scope.private = false;
  $scope.followersOnly = true;

    // sets the date to today and time to 7pm with no seconds
  appFactory.resetDate();

  window.test = function(){
    console.log('chosen ', $scope.chosenGenres);
    console.log('appFactory ', appFactory.chosenGenres);
    console.log('genres ', $scope.genres);
  };
 

  var init = function(){
      // load event data
    ref.child("events").child($scope.eventId)
      .on("value",function(info){

        var eventData = info.val();
        appFactory.update($scope,function(scope){
          scope.eventTitle = eventData.title;
          scope.eventDescription = eventData.description;
          scope.eventImage = eventData.image === './assets/albumcover.png' ? '' : eventData.image;
          scope.eventLabel = eventData.label;
          appFactory.chosenGenres = eventData.genre || [];
          scope.private = eventData.private;
          scope.followersOnly = eventData.followersOnly;
        });

        $scope.date.eventDate = new Date(eventData.date);
        // console.log($scope.genres);
        // console.log($scope.genre);
        appFactory.update($scope,function(scope){
          $scope.genres.forEach(function(genre){
            appFactory.chosenGenres.forEach(function(item){
              if(genre.name === item){
                genre.selected = true;
              }
            });
          });
        });
    });
  };

  $scope.saveChanges = function(){
    // var eventTitle, eventDescription, eventImage, eventLabel, eventDate, privateEvent, followersOnly;
    
    // appFactory.update($scope, function(scope){
    //   eventTitle = $scope.eventTitle;
    //   eventDescription = $scope.eventDescription;
    //   // the image url is not required on the form
    //   // maybe have a default image that is used when image is not provided
    //   eventImage = $scope.eventImage || './assets/albumcover.png';
    //   eventLabel = $scope.eventLabel || '';
    //   eventDate = $scope.date.eventDate.getTime();
    //   privateEvent = $scope.private;
    //   followersOnly = $scope.followersOnly;
    // });

    $scope.eventTitle =this.eventTitle;
    var eventTitle = this.eventTitle;
    var eventDescription = this.eventDescription;

    
    var eventImage = this.eventImage || './assets/albumcover.png';
    var eventLabel = this.eventLabel || '';
    var eventDate = $scope.date.eventDate.getTime();
    console.log(eventTitle);
    console.log(eventDescription);
    var privateEvent = this.private;
    var followersOnly = this.followersOnly; 

    var eventRef = ref.child("events").child($scope.eventId);
    eventRef.update({
      'title': eventTitle,
      'description': eventDescription,
      'image': eventImage,
      'label': eventLabel,
      'date': eventDate,
      'private': privateEvent,
      'followersOnly': followersOnly
    });
    eventRef.child("genre").set(appFactory.chosenGenres);

    appFactory.resetGenres();
    $state.go('event', {eventId: $scope.eventId});
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
