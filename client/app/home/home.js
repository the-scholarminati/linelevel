//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('homeController', ['$scope', 
  function($scope){
    $scope.events = [];
    var ref = new Firebase("https://linelevel.firebaseio.com/");

    //reference events endpoint
    var eventsRef = ref.child("events");

    //fetch last 20 events
    eventsRef.limitToLast(20).on('child_added', function(snapshot){
        var data = snapshot.val();
        $scope.events.push(data);  //store data in events array
        console.log(data);
    });
  }
]);

//app.module('main').requires.push('home');