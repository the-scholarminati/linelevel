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

  describe('tabs views', function(){
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


  describe('maximum number of events shown', function(){
    it('should show 20 by default', function(){
      expect($scope.numLimit).toEqual(20);
    });

    it('should hide the showMoreButton by default', function(){
      expect($scope.showMoreButton).toBe(false);
    });

    describe('increaseNumLimit method', function(){
      it('should increase the maximum number of events shown by 20', function(){
        expect($scope.numLimit).toEqual(20);
        $scope.increaseNumLimit();
        expect($scope.numLimit).toEqual(40);
      });
    });
  });


  describe('genres', function(){
    describe('genre list', function(){
      it('should be the right list', function(){
        expect($scope.genres).toEqual([{"name":"Classical","selected":false},{"name":"Jazz","selected":false},{"name":"Pop","selected":false},{"name":"Rock","selected":false},{"name":"Blues","selected":false},{"name":"Folk","selected":false},{"name":"Country","selected":false},{"name":"Electronic","selected":false},{"name":"Experimental","selected":false}]);;
      });
    });

    describe('genres dropdown list', function(){
      it('should be hidden by default', function(){
        expect($scope.showGenres).toBe(false);
      });
    });

    describe('showGenresNow button', function(){
      it('should show the genres dropdown list', function(){
        expect($scope.showGenres).toBe(false);
        $scope.showGenresNow();
        expect($scope.showGenres).toBe(true);
      });
    });
  });


  describe('filter', function(){
    describe('debounce', function(){
      it('should be set to 200', function(){
        expect($scope.debounce).toEqual(200);
      });
    });

    describe('event filter', function(){
      var events = [];
      var event = {};

      beforeEach(function(){
        // get now in milliseconds
        event.date = new Date();
        event.date = event.date.getTime();
        events[0] = event;
      });

      it('should pass for a future date with future view', inject(function(appFactory){
        // add one day to now value
        event.date += 86400000;
        $scope.dateView = {futureView: true};
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(1);
      }));

      it('should fail for a past date with future view', inject(function(appFactory){
        // subtract one day from now value
        event.date -= 86400000;
        $scope.dateView = {futureView: true};
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(0);
      }));

      it('should pass for a past date with past view', inject(function(appFactory){
        // subtract one day from now value
        event.date -= 86400000;
        $scope.dateView = {pastView: true};
        var filtered = $scope.filteredEvents(events);

        expect(filtered.length).toEqual(1);
      }));

      it('should fail for a future date with past view', inject(function(appFactory){
        // add one day to now value
        event.date += 86400000;
        $scope.dateView = {pastView: true};
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(0);
      }));

      it('should pass for a past date with custom view with past date range', inject(function(appFactory){
        // subtract one day from now value
        event.date -= 86400000;
        var start = new Date(event.date - 86400000);
        var end = new Date(event.date + 86400000);
        $scope.dateView = {start: start, end: end};
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(1);
      }));

      it('should fail for a past date with custom view with future date range', inject(function(appFactory){
        // subtract one day from now value
        event.date -= 86400000;
        var start = new Date(event.date + 86400000);
        var end = new Date(event.date + (86400000 * 2));
        $scope.dateView = {start: start, end: end};
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(0);
      }));

      it('should pass if the event genres and user chosen genres are the same', inject(function(appFactory){
        // set the date to pass
        event.date += 86400000;
        $scope.dateView = {futureView: true};

        event.genre = ['Classical', 'Jazz'];
        $scope.chosenGenres = ['Classical', 'Jazz'];
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(1);
      }));

      it("should fail if one of the user's chosen genres are not in the event genres", inject(function(appFactory){
        // set the date to pass
        event.date += 86400000;
        $scope.dateView = {futureView: true};

        event.genre = ['Classical', 'Jazz'];
        $scope.chosenGenres = ['Classical', 'Electronic'];
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(0);
      }));

      it("should pass if all of the user's chosen genres are in the event genres", inject(function(appFactory){
        // set the date to pass
        event.date += 86400000;
        $scope.dateView = {futureView: true};

        event.genre = ['Classical', 'Electronic', 'Jazz'];
        $scope.chosenGenres = ['Classical', 'Electronic'];
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(1);
      }));

      it('should update the events length count if an event passes', function(){
        // subtract one day from now value
        event.date -= 86400000;
        var start = new Date(event.date - 86400000);
        var end = new Date(event.date + 86400000);
        $scope.dateView = {start: start, end: end};
        var filtered = $scope.filteredEvents(events);
        expect($scope.eventsLength).toEqual(1);
      });

      it('should not update the events length count if an event fails', function(){
        // subtract one day from now value
        event.date -= 86400000;
        $scope.dateView = {futureView: true};
        var filtered = $scope.filteredEvents(events);
        expect(filtered.length).toEqual(0);
        expect($scope.eventsLength).toEqual(0);
      });

      it('should show the showMoreButton if the events length count is higher than the max number of events shown', function(){
        // lower the max number of events shown for easier testing
        $scope.numLimit = 1;

        // subtract one day from now value
        event.date -= 86400000;
        // push an extra event object with the same date
        events.push(event);
        var start = new Date(event.date - 86400000);
        var end = new Date(event.date + 86400000);
        $scope.dateView = {start: start, end: end};
        var filtered = $scope.filteredEvents(events);

        expect($scope.showMoreButton).toBe(true);
      });

      it('should not show the showMoreButton if the events length count is lower than the max number of events shown', function(){
        // make sure the max number of events shown is still 20
        expect($scope.numLimit).toEqual(20);

        // subtract one day from now value
        event.date -= 86400000;
        // push an extra event object with the same date
        events.push(event);
        var start = new Date(event.date - 86400000);
        var end = new Date(event.date + 86400000);
        $scope.dateView = {start: start, end: end};
        var filtered = $scope.filteredEvents(events);

        expect($scope.showMoreButton).toBe(false);
      });
    });
  });
  
});
