angular.module('starter.services', [])

    .factory("Auth", function ($firebaseAuth) {
        var ref = new Firebase("https://bingoz.firebaseio.com/");
        return $firebaseAuth(ref);
    })
    .factory('Groups', function($firebaseArray) {
        var myService = {
            getGroups: function() {
                var ref = new Firebase("https://bingoz.firebaseio.com/groups");
                var groups;
                var currentPlayerGroups = [];
                var groups = $firebaseArray(ref).$loaded(function (response){
                    return response;
                });

                return groups;
            }
        };
        return myService;
    })
    .factory("GroupsOld", function ($firebaseArray , $rootScope) {
        var ref = new Firebase("https://bingoz.firebaseio.com/groups");
        var groups;
        var currentPlayerGroups = [];
        groups = $firebaseArray(ref);
        groups.$loaded()
            .then(function() {
                groups.forEach(function(group){
                    if(group.players != undefined && group.players.indexOf($rootScope.currentPlayer.$id) > -1){
                        currentPlayerGroups.push(group);
                    }
                });

            })
            .catch(function(err) {
                console.error(err);
            });
        return {
            allGroups:function(){
                return groups;
            },
            currentPlayersGroups:function(){
                return currentPlayerGroups;
            },
            getGroup:function(groupId){

                for(var i = 0 ; i < groups.length ; i++){
                    if(groups[i].$id == groupId){
                        console.log("BINGOOOO");
                        return groups[i];

                    }
                }
            }
        }


    })

    .factory('Notifications', function ($firebaseArray, $http, $rootScope) {
        var appId = "b725d95c-edd7-11e4-af24-97858152d332";


        // Helper Function To Get Valid Players Notifications ID's To use in OneSignal
        function getUsersNotificationsIds(players) {
            var invitedPlayersIds = [];
            for (var key in players) {
                console.log($rootScope.playersKeyArray[key]);
                if ($rootScope.playersKeyArray[key].userNotificationId != 'error to get userNotificationId' && $rootScope.playersKeyArray[key].pushNotifications != false) {
                    invitedPlayersIds.push($rootScope.playersKeyArray[key].userNotificationId);
                }
            }
            return invitedPlayersIds;
        }


        return {
            sendNewGameNotification: function (newGame, invitedPlayersIds, createdByUser) {
               console.log("LISTTTT");
                console.log(invitedPlayersIds);
                var data = {
                    "app_id": appId,
                    "include_player_ids": invitedPlayersIds,
                    "isAndroid": true,
                    "isIos": true,
                    "ios_badgeType": "Increase",
                    "ios_badgeCount": 1,
                    "contents": {"en": createdByUser.nickName + ' Has Created New Game , Hurry Up And Join The Game !'}
                }

                $http.post('https://onesignal.com/api/v1/notifications', data).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log("Success");
                        console.log(data);
                        console.log(status);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            },
            sendGroupInviteNotification: function (groupName, invitedPlayersIds, createdByUser) {

                var data = {
                    "app_id": appId,
                    "include_player_ids": invitedPlayersIds,
                    "isAndroid": true,
                    "isIos": true,
                    "ios_badgeType": "Increase",
                    "ios_badgeCount": 1,
                    "contents": {"en": createdByUser.nickName + " Has Joined You To He's Group - " + groupName}
                }

                $http.post('https://onesignal.com/api/v1/notifications', data).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log("Success");
                        console.log(data);
                        console.log(status);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            },
            playerJoinGameNotification: function (currentUser, invitedPlayers) {
                var invitedPlayersIds = getUsersNotificationsIds(invitedPlayers);
                console.log("INvite");
                console.log(invitedPlayersIds);
                var data = {
                    "app_id": appId,
                    "include_player_ids": invitedPlayersIds,
                    "isAndroid": true,
                    "isIos": true,
                    "ios_badgeType": "Increase",
                    "ios_badgeCount": 1,
                    "contents": {"en": currentUser.nickName + ' Has Joined The Game :)'}
                }

                $http.post('https://onesignal.com/api/v1/notifications', data).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log("Success");
                        console.log(data);
                        console.log(status);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        };


    })
    .factory('Chats', function ($firebaseArray) {
        // Might use a resource here that returns a JSON array


        var ref = new Firebase("https://bingoz.firebaseio.com/games");
        var games = $firebaseArray(ref);


        return {
            getGames: function () {
                return games;
            },
            getGame: function (gameId) {

                for (var key in games) {
                    console.log(key);
                    if (key == gameId) {
                        return games[key];
                    }

                }
                return null;

            },
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    });
