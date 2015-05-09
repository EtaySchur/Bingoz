angular.module('starter.services', [])

.factory("Auth", function($firebaseAuth) {
  var ref = new Firebase("https://bingoz.firebaseio.com/");
  return $firebaseAuth(ref);
})

.factory('Notifications', function($firebaseArray , $http , $rootScope) {
    var appId = "b725d95c-edd7-11e4-af24-97858152d332";

    function getUsersNotificationsIds (players){
        var invitedPlayersIds = [];
        for (var key in players) {
            console.log($rootScope.playersKeyArray[key]);
            if($rootScope.playersKeyArray[key].userNotificationId != 'error to get userNotificationId'){
                invitedPlayersIds.push($rootScope.playersKeyArray[key].userNotificationId);
            }
        }
        return invitedPlayersIds;
    }


    return {
        sendNewGameNotification:function(newGame , invitedPlayersIds , createdByUser){

            var data = {
                "app_id": appId,
                "include_player_ids":invitedPlayersIds,
                "isAndroid":true,
                "isIos":true,
                "ios_badgeType":"Increase",
                "ios_badgeCount":1,
                "contents": {"en": createdByUser.nickName+' Has Created New Game , Hurry Up And Join The Game !'}
            }

            $http.post('https://onesignal.com/api/v1/notifications',data).
            success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log("Success");
                        console.log(data);
                        console.log(status);
                    }).
            error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
        },
        playerJoinGameNotification:function(currentUser , invitedPlayers){
            var invitedPlayersIds = getUsersNotificationsIds(invitedPlayers);

            var data = {
                "app_id": appId,
                "include_player_ids":invitedPlayersIds,
                "isAndroid":true,
                "isIos":true,
                "ios_badgeType":"Increase",
                "ios_badgeCount":1,
                "contents": {"en": currentUser.nickName+' Has Joined The Game :)'}
}

$http.post('https://onesignal.com/api/v1/notifications',data).
success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log("Success");
                        console.log(data);
                        console.log(status);
                    }).
error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
}
};


})
.factory('Chats', function($firebaseArray) {
  // Might use a resource here that returns a JSON array


  var ref = new Firebase("https://bingoz.firebaseio.com/games");
  var games =  $firebaseArray(ref);



        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Andrew Jostlin',
            lastText: 'Did you get the ice cream?',
            face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
        }, {
            id: 3,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 4,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
        }];

        return {
            getGames:function(){
              return games;
          },
          getGame:function(gameId){

            for (var key in games) {
                console.log(key);
                if(key == gameId){
                    return games[key];
                }

            }
            return null;

        },
        all: function() {
          return chats;
      },
      remove: function(chat) {
          chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
          for (var i = 0; i < chats.length; i++) {
            if (chats[i].id === parseInt(chatId)) {
              return chats[i];
          }
      }
      return null;
  }
};
});
