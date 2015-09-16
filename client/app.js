var app = angular.module('main', ['firebase', 'ui.router', 'ngAnimate'])

.config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/home');
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: './app/home/home.html',
      controller: function(appFactory){
        appFactory.resetGenres();
      }
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
      url: '/userProfile?userName',
      templateUrl: './app/userProfile/userProfile.html',
      controller: function($scope, $stateParams){
        $scope.userName = $stateParams.userName;
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
      url: '/event?eventId',
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

.controller('mainCtrl', ['$scope', '$firebaseObject', '$state', '$location', '$timeout', 'appFactory', function($scope, $firebaseObject, $state, $location, $timeout, appFactory) {

  /******************************
    Firebase
  ******************************/

  // define a reference to the firebase database
  var ref = new Firebase('https://linelevel.firebaseio.com');
  var userAuth = ref.getAuth();
  
  $scope.auth = function(){
    return ref.getAuth() !== null;
  };

  appFactory.userInit();


  /******************************
    Header links
  ******************************/

  $scope.goProfile = function(){
    // gets the user's username and sets it to the scope
    // so we can route them to their profile from any page
    $scope.userName = '';
    $scope.userAuth = ref.getAuth();
    if ($scope.userAuth){
      appFactory.accessUserByUid($scope.userAuth.uid, function(userData){
        appFactory.update($scope,function(scope){
          $scope.userName = userData.val().username;
          appFactory.user = userData.val().username;
          console.log("app user assignment" + appFactory.user);

          $state.go('userProfile', {userName: $scope.userName});
        });
      });
    }
  };


  $scope.signIn = function(){
    // hide hamburger menu if it's open
    $scope.showHamburgerMenu = false;

    // save the current route for redirect
    appFactory.prevRoute = {
      state: $location.path().slice(1) || 'home',
      params: $location.search()
    };

    // go to the signin page
    $state.go('signin');
  };


  $scope.signOut = function(){
    // hide hamburger menu if it's open
    $scope.showHamburgerMenu = false;

    ref.unauth();
    $scope.userAuth = null;
    appFactory.user = null;
  };


  /******************************
    Notifications
  ******************************/

  // import notifications from appFactory
  $scope.notifications = appFactory.notifications;
  $scope.newNotifications = appFactory.newNotifications;
  console.log('scope new notifs', $scope.newNotifications);


  if(userAuth !== null){
    appFactory.getNotifications(ref.getAuth().uid);
  }

  window.data = function(){
    console.log('scope new notifs', $scope.newNotifications);
  };

  $scope.$watch(function(scope){return appFactory.newNotifications;},function(nv,ov){
    appFactory.update($scope,function(scope){
      scope.newNotifications = nv;
    });
  });


  $scope.showNotificationsList = false;


  $scope.showNotificationsListNow = function(){
    $scope.showNotificationsList = !$scope.showNotificationsList;
  };


  $scope.goNotificationLink = function(index){
    $scope.showNotificationsList = false;

    var notification = $scope.notifications[index];
    if (notification.url[0] === 'userProfile'){
      $state.go(notification.url[0], {userName: notification.url[1]});
    } else if (notification.url[0] === 'event'){
      $state.go(notification.url[0], {eventId: notification.url[1]});
    } else {
      $scope.goProfile();
    }
  };


  $scope.deleteNotification = function(notificationId){
    appFactory.deleteNotification(notificationId);
    if(appFactory.noNotificationsLeft()){
      $timeout(function(){
        $scope.showNotificationsList = false;
      }, 1000);
    }
  };


  $scope.deleteAllNotifications = function(){
    appFactory.accessUserByUid(ref.getAuth().uid, function(userData){
      var userName = userData.val().username;
      appFactory.deleteAllNotifications(userName);
      
      // hide notification list after a pause
      // so the user can see the notifications removed before it closes
      $timeout(function(){
        $scope.showNotificationsList = false;
      }, 1000);
    });
  };


  /******************************
    Hamburger menu
  ******************************/

  $scope.showHamburgerMenu = false;
  $scope.showHamburgerMenuNow = function(){
    $scope.showHamburgerMenu = !$scope.showHamburgerMenu;
  };


  $scope.hideHamburgerMenu = function(){
    // hide hamburger menu if it's open
    $scope.showHamburgerMenu = false;
  };


  /******************************
    Misc
  ******************************/

  // download the data into a local object
  var syncObject = $firebaseObject(ref);

  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, 'data');
  $state.go('home');
}]);
