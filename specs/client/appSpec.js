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

  
});