// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ionic.utils', 'starter.controllers', 'starter.services' , 'firebase' , 'ngCordova' ])

.run(function($ionicPlatform, $rootScope, $localstorage, $location, $state, $firebaseAuth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
  // We can catch the error thrown when the $requireAuth promise is rejected
  // and redirect the user back to the home page
  if (error === "AUTH_REQUIRED") {
    $state.go('signin');  
  }
});

  // $rootScope.notificationToken = window.plugins.OneSignal.init("3b17d8f2-ede5-11e4-bd44-df53b0e80d36",{googleProjectNumber: "857924958148"});

  // $rootScope.ref = new Firebase("https://bingoz.firebaseio.com/");
  // $rootScope.authUser = $firebaseAuth($rootScope.ref);
  // $rootScope.currentUser = $rootScope.authUser.$getAuth();
  //   console.log(JSON.stringify($rootScope.currentUser));
  // //to log out uncomment this line
  //  // $rootScope.ref.unauth();

  // $rootScope.authUser.$onAuth(function(authData) {
  //   if (authData) {
  //     console.log("Logged in as:", authData.uid);
  //   } else {
  //     console.log("Logged out");
  //     $state.go('signin');  
  //   }
  // });
  // // if($rootScope.currentUser && $rootScope.currentUser !== "null" && $rootScope.currentUser !== "undefined"){
  //   console.log("app auth");
  //     $state.go('signin');    
  // }


})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$waitForAuth();
      }]
    }
  })

  // Each tab has its own nav history stack:
  .state('signin', {
    url: '/sign-in',
    templateUrl: 'templates/sign-in.html',
    controller: 'SignInCtrl'
  })

  .state('signup', {
    url: '/sign-up',
    templateUrl: 'templates/sign-up.html',
    controller: 'SignUpCtrl'
  })

  .state('tab.settings', {
    url: "/settings",
    views: {
      'tab-settings': {
        templateUrl: "templates/tab-settings.html",
        controller: 'SettingsCtrl'
      }
    },
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$requireAuth();
      }]
    }


  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/sidemenu.html',
        controller: 'DashCtrl'
      }
    },
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$requireAuth();
      }]
    }
  })

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-groups.html',
        controller: 'ChatsCtrl'
      }
    },
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$requireAuth();
      }]
    }
  })
  .state('tab.chat-detail', {
    url: '/chats/:groupId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'GroupDetailCtrl'
      }
    }
  })
  .state('tab.game-detail', {
    url: '/games/:gameId',
    views: {
      'tab-account': {
        templateUrl: 'templates/game-detail-old.html',
        controller: 'GameDetailCtrl'
      }
    }
  })

  .state('tab.games', {
    url: '/games',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-games.html',
        controller: 'GamesCtrl'
      }
    },
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$requireAuth();
      }]
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});


app.filter('queryPlayer', function() {

  return function(input, query) {

    var out = [];
    if(query == ''){
      return out;
    }else{
      for (var i = 0; i < input.length; i++){
        if(query != undefined){
          if((input[i].nickName).toLowerCase().indexOf(query.toLowerCase()) > -1 ){
            out.push(input[i]);
          }
        }

      }
      return out;
    }

  };
});

app.filter('toArray', function() { return function(obj) {
    if (!(obj instanceof Object)) return obj;
    return _.map(obj, function(val, key) {
        return Object.defineProperty(val, '$key', {__proto__: null, value: key});
    });
}});


app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {

        var filtered = [];
        angular.forEach(items, function(item) {

            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            if(a[field] == undefined)
                a[field] = 0;
            if(b[field] == undefined)
                b[field] = 0;

            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});
