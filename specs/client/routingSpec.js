describe('routing', function(){
  var state;
  beforeEach(module('main'));
  beforeEach(module('ui.router'));

  describe('home route', function(){
    beforeEach(inject(function ($state, $rootScope) {
      state = $state.get('home');
    }));
    
    it('matches the root path', function () {
      expect(state.url).toEqual('/');
    });

    it('renders the home page', function () {
      expect(state.templateUrl).toEqual('./app/home/home.html');
    });

    // it('uses the right controller', function () {
    //   expect(state.controller).toEqual(...);
    // });
  });

  describe('signup route', function(){
    beforeEach(inject(function ($state, $rootScope) {
      state = $state.get('signup');
    }));
    
    it('matches the root path', function () {
      expect(state.url).toEqual('/signup');
    });

    it('renders the signup page', function () {
      expect(state.templateUrl).toEqual('./app/signup/signup.html');
    });

    // it('uses the right controller', function () {
    //   expect(state.controller).toEqual(...);
    // });
  });

  describe('userProfile route', function(){
    beforeEach(inject(function ($state, $rootScope) {
      state = $state.get('userProfile');
    }));
    
    it('matches the root path', function () {
      expect(state.url).toEqual('/userProfile/:userId');
    });

    it('renders the userProfile page', function () {
      expect(state.templateUrl).toEqual('./app/userProfile/userProfile.html');
    });

    // it('uses the right controller', function () {
    //   expect(state.controller).toEqual(...);
    // });
  });

  describe('createEvent route', function(){
    beforeEach(inject(function ($state, $rootScope) {
      state = $state.get('createEvent');
    }));
    
    it('matches the root path', function () {
      expect(state.url).toEqual('/createEvent');
    });

    it('renders the createEvent page', function () {
      expect(state.templateUrl).toEqual('./app/createEvent/createEvent.html');
    });

    // it('uses the right controller', function () {
    //   expect(state.controller).toEqual(...);
    // });
  });

  describe('event route', function(){
    beforeEach(inject(function ($state, $rootScope) {
      state = $state.get('event');
    }));
    
    it('matches the root path', function () {
      expect(state.url).toEqual('/event/:eventId');
    });

    it('renders the event page', function () {
      expect(state.templateUrl).toEqual('./app/event/event.html');
    });

    // it('uses the right controller', function () {
    //   expect(state.controller).toEqual(...);
    // });
  });

});