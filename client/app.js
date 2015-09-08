var app = angular.module('main', ['firebase', 'ui.router', 'ngAnimate'])

.config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/home');
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: './app/home/home.html'
    })
    .state('about', {
      url: '/about',
      templateUrl: './app/about/about.html'
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
    .state('oauth2callback', {
      url: '/oauth2callback/:accessToken',
      templateUrl: './app/event/event.html',
      controller: function($scope, $stateParams){
        alert('is this working!??!');
        $scope.accessToken = $stateParams.accessToken;
        console.log("params access token" + $stateParams.accessToken);
        console.log("Scope access token" + $scope.accessToken);
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
    .state('editevent', {
      url: '/editevent/:eventId',
      templateUrl: './app/event/editevent.html',
      controller: function($scope, $stateParams){
        $scope.eventId = $stateParams.eventId;
      }
    });
}])

.run(['$state', function($state){
  $state.transitionTo('home');
}])

.controller('mainCtrl', ['$scope', '$firebaseObject', '$state', 'appFactory', function($scope, $firebaseObject, $state, appFactory) {
  // define a reference to the firebase database
  var ref = new Firebase('https://linelevel.firebaseio.com/data');
  
  $scope.auth = function(){
    return ref.getAuth() !== null;
  };

  $scope.signOut = function(){
    ref.unauth();
    $state.go('about');
  };

  // download the data into a local object
  var syncObject = $firebaseObject(ref);

  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, 'data');
  $state.go('home');
}]);
