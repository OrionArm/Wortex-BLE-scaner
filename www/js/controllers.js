angular.module('starter.controllers', [])

  .controller('DashCtrl', ['$scope', '$cordovaBluetoothLE', function ($scope, $cordovaBluetoothLE) {

  }])

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, $ionicPlatform, $cordovaBluetoothLE) {

    console.debug('Starting BLE scan...');
    $ionicPlatform.ready(function () {
      $cordovaBluetoothLE.startScan({services: []}).then(null,
        function (obj) {
          //Handle errors
          console.log('Error while scanning: ' + obj.message);
        },
        function (obj) {
          console.log(obj);
          if (obj.status == "scanResult") {
            //Device found
          }
          else if (obj.status == "scanStarted") {
            //Scan started
          }
        }
      );
    });

    $scope.settings = {
      enableFriends: true
    };
  });
