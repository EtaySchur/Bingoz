angular.module('starter.controllers', [])

    .controller('SignInCtrl', function ($scope, $state, $rootScope) {

        $scope.signIn = function (user) {
            $scope.showSpinner = true;
            $rootScope.authUser.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function (authData) {
                $scope.showSpinner = false;
                console.log("Logged in as:", $rootScope.authUser);
                $rootScope.currentUser = authData;
                $state.go("tab.dash");
            }).catch(function (error) {
                $scope.showSpinner = false;
                console.error("Authentication failed:", error);
            });
        }

        $scope.signInWithFB = function () {
            $rootScope.authUser.$authWithOAuthPopup("facebook").then(function (authData) {
                console.log("Logged in as:", authData);
                $state.go("tab.dash");
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });
        }
    })

    .controller('SignUpCtrl', function ($scope, $rootScope, $localstorage, $state, $location, $timeout, Auth) {
        $rootScope.ref = new Firebase("https://bingoz.firebaseio.com/");
        var userNotificationId, userNotificationToken;
        document.addEventListener("deviceready", function () {
            $timeout(function () {
                window.plugins.OneSignal.init("b725d95c-edd7-11e4-af24-97858152d332", {googleProjectNumber: "857924958148", autoRegister: true});
                window.plugins.OneSignal.getIds(function (ids) {
                    userNotificationId = ids.userId;
                    userNotificationToken = ids.pushToken;
                });
            }, 300)
        }, false);

        var players = new Firebase("https://bingoz.firebaseio.com/players");
        $scope.creatAccount = function (user) {
            if (user.password == user.confirmPassword) {
                $scope.showSpinner = true;
                $rootScope.errors.confirmPassword = false;
                $rootScope.ref.createUser({
                    email: user.email,
                    password: user.password
                }, function (error, userData) {
                    if (error) {
                        $scope.showSpinner = false;
                        $rootScope.$digest();
                        console.log("Error creating user:", error);
                    } else {
                        players.child(userData.uid).set({
                            // firstName: user.firstName,
                            // lastName: user.lastName,
                            // fullName: user.firstName+" "+user.lastName,
                            nickName: user.email.replace(/@.*/, ''),
                            userNotificationId: userNotificationId || "error to get userNotificationId",
                            userNotificationToken: userNotificationToken || "error to get userNotificationToken",
                            pushNotifications: true
                        }, function (error) {
                            if (error) {
                                $scope.showSpinner = false;
                            } else {
                                $rootScope.ref.authWithPassword({
                                    email: user.email,
                                    password: user.password
                                }, function (error, authData) {
                                    $scope.showSpinner = false;
                                    $rootScope.$digest();
                                    if (error) {
                                        console.log("Login Failed!", error);
                                    } else {
                                        console.log("")
                                        $rootScope.currentUser = authData;
                                        $location.path('/tab/dash');
                                        $rootScope.$digest();

                                    }
                                });

                            }
                        });
                    }

                });
            } else {
                $rootScope.errors.confirmPassword = true;
            }

        }
    })

    .controller('MainController', function ($scope, $rootScope, $firebaseArray, $cordovaFacebook, $ionicPlatform, Auth) {
        $rootScope.errors = {};
        $rootScope.authUser = Auth;
        $rootScope.currentUser = $rootScope.authUser.$getAuth();
        console.log($rootScope.authUser.$getAuth());

        $rootScope.playersKeyArray = {};

        $rootScope.checkMe = function (game) {


            if (game.players != undefined) {
                var numOfPlayers = 0;
                for (var key in game.players) {
                    if (game.players[key].chanceToCome == 100) {
                        numOfPlayers++;
                    }
                }
                return numOfPlayers;
            }


        }

        $rootScope.$watch('currentUser' , function(){
            console.log("FIRE ROOT SCOPE WATCH");
            console.log($rootScope.currentUser);
            if($rootScope.currentUser != null){
                var ref = new Firebase("https://bingoz.firebaseio.com/players");
                $rootScope.players = $firebaseArray(ref);
                $rootScope.players.$loaded()
                    .then(function () {
                        $rootScope.players.forEach(function (player) {
                            $rootScope.playersKeyArray[player.$id] = player;
                            if (player.$id == $rootScope.currentUser.uid) {
                                $rootScope.currentPlayer = player;

                            }
                        });
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            }
        });

        $rootScope.convertTimeStampToDate = function (timestamp) {
            var d = new Date(timestamp);
            return d.toLocaleDateString();
        };

        // $timeout(function(){

        // },1000);


        /*
         $cordovaFacebook.getLoginStatus()
         .then(function(success) {
         if(success.status == 'connected'){
         $cordovaFacebook.api("me/photos", ["public_profile"])
         .then(function(success) {
         console.log(success);
         }, function (error) {
         // error
         });
         }else{
         $cordovaFacebook.login(["public_profile", "email", "user_friends"])
         .then(function(success) {
         $cordovaFacebook.api("me/photos", ["public_profile"])
         .then(function(success) {
         console.log(success);
         }, function (error) {
         // error
         });
         }, function (error) {
         console.log(error);
         });
         }
         */
        /*
         { authResponse: {
         userID: "12345678912345",
         accessToken: "kgkh3g42kh4g23kh4g2kh34g2kg4k2h4gkh3g4k2h4gk23h4gk2h34gk234gk2h34AndSoOn",
         session_Key: true,
         expiresIn: "5183738",
         sig: "..."
         },
         status: "connected"
         }
         */
        /*}, function (error) {
         // error
         });
         */


        // this waits for the data to load and then logs the output. Therefore,
        // data from the server will now appear in the logged output. Use this with care!


    })


    .controller('DashCtrl', function ($scope, $rootScope) {
        console.log($rootScope.currentUser);

    })

    .controller('SettingsCtrl', function ($rootScope, $scope, $cordovaCamera, $cordovaImagePicker, $state) {
        console.log($rootScope.currentPlayer);
        $scope.pickPhoto = function () {
            var options = {
                maximumImagesCount: 10,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                width: 800,
                height: 800,
                popoverOptions: CameraPopoverOptions,
                encodingType: Camera.EncodingType.JPEG,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {

                        $rootScope.currentPlayer.image = {image: results[i]};
                        $rootScope.players.$save($rootScope.currentPlayer);
                    }
                }, function (error) {
                    // error getting photos
                });
        }

        $scope.upload = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                console.log(imageData);
                $rootScope.currentPlayer.image = {image: imageData};
                $rootScope.players.$save($rootScope.currentPlayer);
            }, function (error) {
                console.error(error);
            });
        }

        $scope.logOut = function () {
            console.log($rootScope.currentUser);
            $rootScope.authUser.$unauth();
            $state.go("signin");
        }
    })

    .controller('ChatsCtrl', function ($rootScope, $scope, $firebaseArray, $ionicModal, Groups) {
        Groups.getGroups().then(function (data) {
            $scope.groups = data;
            $scope.currentPlayerGroups = [];
            $scope.groups.forEach(function (group) {
                if (group.players != undefined && group.players.indexOf($rootScope.currentPlayer.$id) > -1) {
                    $scope.currentPlayerGroups.push(group);
                    console.log("Current Players Group");
                    console.log($scope.currentPlayerGroups);
                }
            });
        });


        $ionicModal.fromTemplateUrl('add-group-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

        });

        $scope.addNewGroup = function (newGroup) {
            if(newGroup == undefined || newGroup.name == undefined || newGroup.name.length < 1){
                $scope.groupNameReqError = true;
                return;
            }else{
                $scope.groupNameReqError = false;
               $scope.closeModal();
            }
            if($scope.newGroup.description == undefined){
                $scope.newGroup.description = '';
            }

            var date = new Date().getTime();
            $scope.groups.$add({
                name: $scope.newGroup.name,
                description: $scope.newGroup.description,
                date: date,
                createdBy: $rootScope.currentUser.uid,
                players: [$rootScope.currentPlayer.$id]
            });
        };

        $scope.updateGroupDescription = function (groupDesc) {
            $scope.newGroup.description = groupDesc;
        }

        $scope.updateGroupName = function (groupName) {
            $scope.newGroup.name = groupName;
        }


        $scope.openModal = function () {
            $scope.newGroup = {};
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    })
    .controller('GroupDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicModal, Notifications, Groups) {
        var groupId = $stateParams.groupId;
        Groups.getGroups().then(function (data) {
            $scope.groups = data;
            for (var i = 0; i < $scope.groups.length; i++) {
                if ($scope.groups[i].$id == groupId) {
                    $scope.currentGroup = $scope.groups[i];

                }
            }
        });

        $scope.updateMessage = function (text) {
            $scope.messageText = text;
        }

        $scope.updatePlayer = function (player, isChecked) {
            if (isChecked) {
                $scope.selectedPlayers.push(player);
            } else {
                var index = $scope.selectedPlayers.indexOf(player);
                $scope.selectedPlayers.splice(index, 1);
            }
        }

        $scope.sendMessage = function () {
            if ($scope.currentGroup.messages == undefined) {
                $scope.currentGroup.messages = []
            }

            var newMessage = {
                user: $rootScope.currentPlayer,
                text: $scope.messageText,
                date: new Date()
            }

            $scope.currentGroup.messages.push(newMessage);
            $scope.groups.$save($scope.currentGroup);

            $scope.messageText = '';

        }

        $scope.addNewPlayersToGroup = function () {
            var usersNotificationsIds = [];
            $scope.selectedPlayers.forEach(function (player) {
                usersNotificationsIds.push(player.userNotificationId);
                $scope.currentGroup.players.push(player.$id);
            });

            Notifications.sendGroupInviteNotification($scope.currentGroup.name, usersNotificationsIds, $rootScope.currentPlayer);
            $scope.groups.$save($scope.currentGroup);
            $scope.modal.hide();
        }

        $ionicModal.fromTemplateUrl('add-group-players-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

        });


        $scope.openModal = function () {
            $scope.selectedPlayers = [];
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


    })
    .controller('GameDetailCtrl', function ($rootScope, $scope, $stateParams, Chats, $ionicModal, $cordovaCamera , Groups , Notifications , $ionicPopover) {

        $ionicPopover.fromTemplateUrl('game-action-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });



        $ionicModal.fromTemplateUrl('player_stuff.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

        });


        $ionicModal.fromTemplateUrl('invite-players-status-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.invitedPlayersModal = modal;

        });


        $scope.openModal = function () {
            $scope.modal.show();
        };


        $scope.openInvitedPlayersStatusModal = function(){
            $scope.invitedPlayersModal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });




        $scope.playersInTable = [
            {
                id: 0,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "50px",
                left: "150px"
            },
            {
                id: 1,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "80px",
                left: "225px"
            },
            {
                id: 2,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "155px",
                left: "250px"
            },
            {
                id: 3,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "260px",
                left: "249px"
            },
            {
                id: 4,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "330px",
                left: "220px"
            },
            {
                id: 5,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "360px",
                left: "150px"
            },
            {
                id: 6,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "330px",
                left: "79px"
            },
            {
                id: 7,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "260px",
                left: "52px"
            },
            {
                id: 8,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "155px",
                left: "50px"
            },
            {
                id: 9,
                imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
                top: "80px",
                left: "70px"
            },
            // {
            // 	id:10,
            // 	imgPath: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
            // 	top:"128px",
            // 	left:"77px"
            // }
        ];

        $scope.saveMe = function (game , chanceToCome) {
            if(chanceToCome == 100){
                var numOfAvailablePlaces = game.maxPlayers - $rootScope.checkMe(game);

                Notifications.sendPlayerIsFullyAttendToCome(game.players , $rootScope.currentPlayer , game , numOfAvailablePlaces )
            }
            $scope.currentPlayerStats = $scope.game.players[$scope.key];
            $scope.games.$save(game);
        }



        $scope.addMeToThisGame = function (game) {
            if (game.players == undefined) {
                game.players = {};
            }
            console.log(game.players[$rootScope.currentPlayer.$id].attendToCome);
            game.players[$rootScope.currentPlayer.$id].attendToCome = true;
            var string = $rootScope.currentPlayer.nickName+" Has Joined The Game "+game.name;
            var newMessage = {
                user: "System Alert",
                text: string,
                date: new Date()
            }
            $scope.currentGroup.messages.push(newMessage);
            $scope.groups.$save($scope.currentGroup);


            $scope.games.$save(game);
            Notifications.playerJoinGameNotification($rootScope.currentPlayer, game.players);
        };

        $scope.classMe = function () {
            function apply() {
                $scope.$apply();
            }


            if ($scope.game.players[$scope.key].chanceToCome <= 30) {

                $scope.barColor = 'range-assertive';
            } else if ($scope.game.players[$scope.key].chanceToCome >= 70) {

                $scope.barColor = "range-balanced";
            } else {

                $scope.barColor = "range-positive";
            }


        }

        $scope.updateGroup = function(value , item){
            if(value){
                var string = $rootScope.currentPlayer.nickName+" Will Bring "+item+" With Him";
            }else{
                var string = $rootScope.currentPlayer.nickName+" WONT Bring "+item+" With Him ( Sharmit )";
            }
            var newMessage = {
                user: "System Alert",
                text: string,
                date: new Date()
            }
            $scope.currentGroup.messages.push(newMessage);
            $scope.groups.$save($scope.currentGroup);
        }


        $scope.games = (Chats.getGames());
        $scope.games.$loaded()
            .then(function () {
                $scope.games.forEach(function (game) {
                    if (game.$id == $stateParams.gameId) {
                        $scope.game = game;
                        Groups.getGroups().then(function (data) {
                            $scope.groups = data;
                            for (var i = 0; i < $scope.groups.length; i++) {
                                if ($scope.groups[i].$id == game.groupId) {
                                    $scope.currentGroup = $scope.groups[i];

                                }
                            }
                        });
                        if (game.players != undefined) {
                            for (var key in game.players) {
                                if (key == $rootScope.currentPlayer.$id) {
                                    $scope.key = key;
                                    $scope.currentPlayerStats = game.players[key];
                                }

                            }

                        }

                    }
                    console.log("this is curent player stats");
                    console.log($scope.currentPlayerStats);
                });


            })
            .catch(function (err) {
                console.error(err);
            });





    })

    .controller('GamesCtrl', function ($rootScope, $scope, $firebaseArray, $ionicModal, $rootScope, $cordovaDatePicker, $http, Notifications, Groups , $cordovaDialogs) {

        Groups.getGroups().then(function (data) {
            $scope.groups = data;
            $scope.currentPlayerGroups = [];
            $scope.groups.forEach(function (group) {
                if (group.players != undefined && group.players.indexOf($rootScope.currentPlayer.$id) > -1) {
                    $scope.currentPlayerGroups.push(group);
                    console.log("Current Players Group");
                    console.log($scope.currentPlayerGroups);
                }
            });
        });


        $scope.openDeleteDialog = function (game){

            $cordovaDialogs.confirm('Are You Sure ?', 'Delete Game', ['Yes','Cancel'])
                .then(function(buttonIndex) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                    if(buttonIndex == 1){
                        $scope.games.$remove(game)
                    }
                    if(buttonIndex == 2){

                    }
                });
        }



        var dateOptions = {
            date: new Date(),
            mode: 'date' // or 'time'

        };

        var timeOptions = {
            date: new Date(),
            mode: 'time' // or 'time'
        };

        $scope.pickDate = function () {
            $cordovaDatePicker.show(dateOptions).then(function (date) {
                $scope.newGame.date = date;
            });
        };

        $scope.pickTime = function () {
            $cordovaDatePicker.show(timeOptions).then(function (time) {
                $scope.newGame.time = time;
            });

        };

        var ref = new Firebase("https://bingoz.firebaseio.com/games");
        $scope.games = $firebaseArray(ref);
        $scope.games.$loaded()
            .then(function () {

            })
            .catch(function (err) {
                console.error(err);
            });
        // add new items to the array
        // the message is automatically added to Firebase!



        $scope.addNewGame = function () {
            var usersObjectsList = {};
            var usersNotificationsIdsList = [];

            $scope.groups.forEach(function (group) {
                if (group.$id == $scope.newGame.groupId) {
                    $scope.newGame.group = angular.copy(group);
                }
            });

            // Add Players Group Info
            $scope.newGame.group.players.forEach(function (playerId) {
                usersObjectsList[playerId] = {
                    attendToCome: false
                }
                if ($rootScope.playersKeyArray[playerId].userNotificationId != 'error to get userNotificationId' && $rootScope.playersKeyArray[playerId].pushNotifications != false) {
                    usersNotificationsIdsList.push($rootScope.playersKeyArray[playerId].userNotificationId);
                }
            });

            // Adding Current Player Info
            usersObjectsList[$rootScope.currentUser.uid] = {
                attendToCome: true,
                chanceToCome: 100
            }



            $scope.games.$add({
                name: $scope.newGame.name,
                location: $scope.newGame.location,
                date: ($scope.newGame.date).getTime(),
                createdBy: $rootScope.currentUser.uid,
                maxPlayers: $scope.newGame.maxPlayers,
                time: ($scope.newGame.time).getTime(),
                players: usersObjectsList,
                groupId:$scope.newGame.group.$id

            });

            // Send Notifications To Users
            Notifications.sendNewGameNotification($scope.newGame, usersNotificationsIdsList , $rootScope.currentPlayer);


            $scope.modal.hide();
        };

        $scope.updateLocation = function (location) {
            $scope.newGame.location = location;
        };

        $scope.updateDate = function (date) {
            $scope.newGame.date = date;
        };

        $scope.updateMaxPlayers = function (maxPlayers) {
            $scope.newGame.maxPlayers = maxPlayers;
        };

        $scope.updateName = function (name) {
            $scope.newGame.name = name;
        };

        $scope.updateInvitedGroup = function (groupId) {
            $scope.newGame.groupId = groupId;
        }

        $scope.removeMe = function (game) {
            for (var key in game.players) {
                if (key == $rootScope.currentPlayer.$id) {
                    game.players[key].attendToCome = false;
                    $scope.games.$save(game);
                }
            }
        };


        $scope.removePlayerFromGame = function(game){


            for (var key in game.players) {
                if (key == $rootScope.currentPlayer.$id) {
                   delete game.players[key];
                   $scope.games.$save(game);
                }
            }
        }

        $scope.trashGame = function (game) {
            for (var key in game.players) {
                if (key == $rootScope.currentPlayer.$id) {
                    delete game.players[key];
                    $scope.games.$save(game);
                }
            }
        };

        $scope.showGroupToCurrentUser = function (group) {
            console.log(group);
            return false;
        };

        $scope.showGameToCurrentUser = function (game) {
            for (var key in game.players) {
                if ($rootScope.currentPlayer != undefined) {
                    if (key == $rootScope.currentPlayer.$id) {
                        return true;
                    }
                }

            }
            return false;
        };

        $scope.invitePlayer = function (player) {
            console.log("Invting Player");
            console.log(player);
            $scope.invitedPlayersList.push(player.$id);
            $scope.invitedPlayersNotificationsList.push(player.userNotificationId);
        };

        $scope.unInvitePlayer = function (player) {
            var playerIndex = $scope.invitedPlayersList.indexOf(player.$id);
            $scope.invitedPlayersList.splice(playerIndex, 1);
            var notificationIndex = $scope.invitedPlayersNotificationsList.indexOf(player.userNotificationId);
            $scope.invitedPlayersNotificationsList.splice(notificationIndex, 1);
        };

        $scope.addMe = function (game) {
            if (game.players == undefined) {
                game.players = {};
            }
            console.log(game.players[$rootScope.currentPlayer.$id].attendToCome);
            game.players[$rootScope.currentPlayer.$id].attendToCome = true;

            $scope.games.$save(game);
            Notifications.playerJoinGameNotification($rootScope.currentPlayer, game.players);
        };

        $scope.showJoinGameButton = function (game) {
            if (game.players != undefined) {
                for (var key in game.players) {
                    if (key == $rootScope.currentPlayer.$id && game.players[key].attendToCome) {
                        return false;
                    }
                }
            }


            return true;
        };

        $ionicModal.fromTemplateUrl('search-players-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.searchPlayersModal = modal;

        });

        $scope.openSearchPlayersModal = function () {
            $scope.searchPlayersModal.show();
        }


        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

        });
        $scope.openModal = function () {
            console.log("Open Modal");
            $scope.invitedPlayersNotificationsList = [];
            $scope.invitedPlayersList = [];
            console.log($rootScope.players);
            $scope.newGame = {
                location: "Fuad Place",
                date: new Date(),
                time: new Date(),
                maxPlayers: "7"
            };

            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // click on `index.html` above to see $remove() and $save() in action
    });
