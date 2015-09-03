describe('appFactory', function(){

  // loads main module
  beforeEach(module('main'));

  // inject(function(appFactory){}) gives us access to the factory and all its properties and methods
  it('can get an instance of the appFactory', inject(function(appFactory) {
    expect(appFactory).toBeDefined();
  }));


  describe('genre functionality', function(){
    describe('chosenGenres', function(){
      it('has the correct genres object', inject(function(appFactory) {
        var genres = [
          {"name":"Classical","selected":false},{"name":"Jazz","selected":false},{"name":"Pop","selected":false},{"name":"Rock","selected":false},{"name":"Blues","selected":false},{"name":"Folk","selected":false},{"name":"Country","selected":false},{"name":"Electronic","selected":false},{"name":"Experimental","selected":false}
          ];
        expect(appFactory.genres).toEqual(genres);
      }));

      it('has an empty chosenGenres array', inject(function(appFactory){
        expect(appFactory.chosenGenres).toEqual([]);
      }));
    });

    describe('chooseGenres', function(){
      it('should add genre names to chosenGenres array', inject(function(appFactory){
        // make sure the chosenGenres array is empty
        expect(appFactory.chosenGenres).toEqual([]);
        // choose a genre
        appFactory.chooseGenre({"name":"Classical","selected":false});
        // check to see if the name of the chosen genre is in the chosenGenres array
        expect(appFactory.chosenGenres).toEqual(["Classical"]);
      }));

      it('should remove genre names from chosenGenres array', inject(function(appFactory){
        // make sure the chosenGenres array is empty
        expect(appFactory.chosenGenres).toEqual([]);
        // choose a genre
        appFactory.chooseGenre({"name":"Classical","selected":false});
        // check to see if the chosen genre is in the chosenGenres array
        expect(appFactory.chosenGenres).toEqual(["Classical"]);
        // choose a that genre again
        appFactory.chooseGenre({"name":"Classical","selected":true});
        // make sure the chosenGenres array is empty again
        expect(appFactory.chosenGenres).toEqual([]);
      }));
    });

    describe('resetGenres', function(){
      it('should empty the chosenGenres array', inject(function(appFactory){
        // make sure the chosenGenres array is empty
        expect(appFactory.chosenGenres).toEqual([]);
        // choose a genre
        appFactory.chooseGenre({"name":"Classical","selected":false});
        // check to see if the genre we chose is in the chosenGenres array
        expect(appFactory.chosenGenres).toEqual(["Classical"]);
        // reset the array
        appFactory.resetGenres();
        // make sure the chosenGenres array is empty again
        expect(appFactory.chosenGenres).toEqual([]);
      }));
    });
  });


  describe('date functionality', function(){
    it('should have an empty date object', inject(function(appFactory){
      expect(appFactory.date).toEqual({});
    }));

    describe('resetDate', function(){
      it('should set the date to today and the time to 7 pm', inject(function(appFactory){
        var date = new Date();;
        date.setHours(19);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        appFactory.resetDate();
        expect(appFactory.date.eventDate).toEqual(date);
      }));
    });
  });

});