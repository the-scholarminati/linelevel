var app = angular.module('main', ['firebase', 'ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: './app/home/home.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: './app/authentication/signup.html'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: './app/authentication/signin.html'
    })
    .state('userProfile', {
      url: '/userProfile/:userId',
      templateUrl: './app/userProfile/userProfile.html',
      controller: function($scope, $stateParams){
        $scope.userId = $stateParams.userId;
      }
    })
    .state('createEvent', {
      url: '/createEvent',
      templateUrl: './app/createEvent/createEvent.html'
    })
    .state('event', {
      url: '/event/:eventId',
      templateUrl: './app/event/event.html',
      controller: function($scope, $stateParams){
        $scope.eventId = $stateParams.eventId;
      }
    })
}])

.run(['$state', function($state){
  $state.transitionTo('home');
}])

.controller('mainCtrl', function($scope, $firebaseObject,$state) {
  // define a reference to the firebase database
  var ref = new Firebase('https://linelevel.firebaseio.com/data');

  // download the data into a local object
  var syncObject = $firebaseObject(ref);

  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, 'data');
  $state.go('home');
});
