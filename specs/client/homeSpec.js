describe('home controller', function(){
  var $rootScope, $scope, $controller;

  // loads main module for all the tests
  beforeEach(module('main'));

  // sets up the controller and scope
  beforeEach(inject(function(_$rootScope_, _$controller_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;

    $controller('homeController', {'$rootScope' : $rootScope, '$scope': $scope});
  }));

  it('should show upcoming events by default', function() {
    expect($scope.dateView.futureView).toBe(true);
  });

  it('should not show past events by default', function() {
    expect($scope.dateView.pastView).toBe(false);
  });

  it('should not show custom date range events by default', function() {
    expect($scope.dateView.customDateView).toBe(false);
  });

  it('should show events in chronological order by default', function() {
    expect($scope.isReverse).toBe(false);
  });


  describe('viewPastEvents method', function(){
    beforeEach(function(){
      $scope.viewPastEvents();
    });

    it('should show past events', function() {
      expect($scope.dateView.pastView).toBe(true);
    });

    it('should not show upcoming events', function() {
      expect($scope.dateView.futureView).toBe(false);
    });

    it('should not show custom date range events', function() {
      expect($scope.dateView.customDateView).toBe(false);
    });

    it('should show events in reverse chronological order', function() {
      expect($scope.isReverse).toBe(true);
    });
  });


  describe('viewFutureEvents method', function(){
    beforeEach(function(){
      $scope.viewPastEvents();
      $scope.viewFutureEvents();
    });

    it('should show upcoming events', function() {
      expect($scope.dateView.futureView).toBe(true);
    });

    it('should not show past events', function() {
      expect($scope.dateView.pastView).toBe(false);
    });

    it('should not show custom date range events', function() {
      expect($scope.dateView.customDateView).toBe(false);
    });

    it('should show events in chronological order', function() {
      expect($scope.isReverse).toBe(false);
    });
  });


  describe('viewDateFilter method', function(){
    beforeEach(function(){
      $scope.viewDateFilter();
    });

    it('should show custom date range events', function() {
      expect($scope.dateView.customDateView).toBe(true);
    });

    it('should not show upcoming events', function() {
      expect($scope.dateView.futureView).toBe(false);
    });

    it('should show past events', function() {
      expect($scope.dateView.pastView).toBe(false);
    });

    it('should show events in chronological order', function() {
      expect($scope.isReverse).toBe(false);
    });
  });

  
});