angular.module('main')

.factory('appFactory', function($http){
  var obj = {};


  ///////////////
  ///// Misc
  ///////////////

  obj.firebase = new Firebase('https://linelevel.firebaseio.com');

  // resets timer on the event page count down when loading an event
  obj.timers = {
    eventCounter: null
  };

  /////////////////////////////////////////////// 
  ///////////////firebase helpers ///////////////
  ///////////////////////////////////////////////

  // important: must use "val" function in order to access userData properties
  obj.accessUserByUid = function(uid,cb){
    return this.auth(function(){
      ref.child("users").child(uid).on("value", function(userData){
        cb.call(this,userData);
      });
    });
  };

  obj.accessUserByUsername = function(username,cb){
    return this.auth(function(){
      ref.child("usernames").child(username).on("value", function(user){
        uid = user.val().uid;
        obj.accessUserByUid(uid,cb);
      });
    });
  };

  // add user to "following" properties (users table)
  obj.followUser = function(username){
    return this.auth(function(user){
      // necessary to make sure username given exists
      obj.accessUserByUsername(username,function(friendData){
        if(friendData !== null){
          ref.child("users").child(user.uid).child("following").child(friendData.val().username)
            .set({
              uid: friendData.val().uid
          });
        }
      });

    });//end of auth
  };

  // remove a user from "following" property (users table)
  obj.unfollowUser = function(username){
    return this.auth(function(user){
      ref.child("users").child(user.uid).child("following").child(username).remove();
    });
  };

  // use call back to perform action on user's "following" list
  obj.getUserFollowList = function(cb){
    return this.auth
    ref.child("users").child(user.uid).child("following").("value", function(list){
      var result = [];
      list = list.val();
      for(var username in list){
        result.push(list[username]);
      }
      cb.call(this,result);
    });
  };

  ///// Authentication - checks if user is authenticated - *cb is optional*
  obj.auth = function(cb){
    if(cb === undefined){
      return this.firebase.getAuth() !== null;
    } else {
      var user = this.firebase.getAuth();
      if(user === null){
        return false;
      } else {
        cb.call(this,user);
      }
    }
  };

  obj.unauth = function(){
    this.firebase.unauth();
  };

  // force angular to display changes made to scope variabes
  obj.update = function(scope,cb){
    if(!scope.$$phase){
      scope.$apply(function(){
        cb.call(this,scope);
      });
    } else {
      cb.call(this,scope);
    }
  };

  // used in event page
  obj.timers = {
    eventCounter: null
  };

  ///////////////
  ///// HTTP
  ///////////////

  obj.startStream = function(token){
    return $http({
      method:'POST',
      url: 'https://www.googleapis.com/youtube/v3/liveStreams?part=snippet&access_token='+token
      }).then(function(response){
        console.log(response);
        return response;
    }, function(error){console.log(error);});
  };


  ///////////////
  ///// Genres
  ///////////////

  var genres = ['Classical', 'Jazz', 'Pop', 'Rock', 'Blues', 'Folk', 'Country', 'Electronic', 'Experimental'];
  obj.genres = genres.reduce(function(array, genre){
    array.push( {name: genre, selected: false} );
    return array;
  }, []);

  obj.chosenGenres = [];

  obj.chooseGenre = function(genre){
    // toggles whether the genre is selected or not
    genre.selected = !genre.selected;

    // adds or removes the genre from the user's chosen genre list as needed
    if (genre.selected){
      obj.chosenGenres.push(genre.name);
    } else {
      var indexOfGenre = obj.chosenGenres.indexOf(genre.name);
      obj.chosenGenres.splice(indexOfGenre, 1);
    }
  };
  

  obj.resetGenres = function(){
    // clears the user's selected genres from factory
    obj.chosenGenres = [];

    // clears selected class from all genres
    obj.genres.forEach(function(genre){
      genre.selected = false;
    });
  };


  ///////////////
  ///// Dates
  ///////////////

  obj.date = {};

  // sets the default time for creating a new event to today at 7pm
  obj.resetDate = function(){
    obj.date.eventDate = new Date();
    obj.date.eventDate.setHours(19);
    obj.date.eventDate.setMinutes(0);
    obj.date.eventDate.setSeconds(0);
    obj.date.eventDate.setMilliseconds(0);
  };


  ///////////////
  ///// Filter
  ///////////////

  obj.dateFilter = function(date, dateView){
    // show determines whether the event will be present after it has been run through the filter
    var show = true;

    // compare now + 1 hour to event date to see if the event has already passed
    var now = new Date();
    var isInFuture = now.getTime() + (60*60*1000) < date;

    // if the user wants to see future events
    if (dateView.futureView){
      show = isInFuture;
    // if the user wants to see past events
    } else if (dateView.pastView){
      show = !isInFuture;
    // if the user has selected a custom date range
    } else if (dateView.start && dateView.end){
      var start = dateView.start.getTime();
      var end = dateView.end.getTime();
      show = date >= start && date <= end;
    }
    return show;
  };


  obj.genreFilter = function(eventGenres, chosenGenres){
    // show determines whether the event will be present after it has been run through the filter
    var show = true;

    chosenGenres.forEach(function(genre){
      if (!eventGenres || eventGenres.indexOf(genre) === -1){
        show = false;
      }
    });

    return show;
  };


  obj.textFilter = function(eventText, filterText){
    // show determines whether the event will be present after it has been run through the filter
    var show = true;

    filterText = filterText.toLowerCase();

    if (eventText){
      eventText = eventText.toLowerCase();
      if ( eventText.indexOf(filterText) === -1 ){
        show = false;
      }
    } else {
      show = false;
    }

    return show;
  };


  return obj;
});
