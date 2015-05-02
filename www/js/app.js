// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.utils', 'starter.controllers', 'starter.services' , 'firebase' , 'ngCordova' ])

.run(function($ionicPlatform, $rootScope, $localstorage, $location) {
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
  // $rootScope.notificationToken = window.plugins.OneSignal.init("3b17d8f2-ede5-11e4-bd44-df53b0e80d36",{googleProjectNumber: "857924958148"});

  $rootScope.ref = new Firebase("https://bingoz.firebaseio.com/");
  $rootScope.currentUser = $rootScope.ref.getAuth();
  //to log out uncomment this line
  // $rootScope.ref.unauth();
  console.log($rootScope.currentUser);
  if($rootScope.currentUser && $rootScope.currentUser !== "null" && $rootScope.currentUser !== "undefined"){
      $location.path('/tab/dash');    
  }


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
    templateUrl: "templates/tabs.html"
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
    }


  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })
  .state('tab.game-detail', {
    url: '/games/:gameId',
    views: {
      'tab-account': {
        templateUrl: 'templates/game-detail.html',
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
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-up');

});
