// Ionic bluetooth_wortex App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'bluetooth_wortex' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'bluetooth_wortex.services' is found in services.js
// 'bluetooth_wortex.controllers' is found in controllers.js
angular.module('bluetooth_wortex', ['ionic', 'bluetooth_wortex.controllers',
  'bluetooth_wortex.services', 'ngCordovaBluetoothLE'])

  .run(function ($ionicPlatform, $cordovaBluetoothLE) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      $cordovaBluetoothLE.initialize({request: true}).then(function (obj) {
          console.log('BLE initialized successfully: ');
        },
        function (obj) {
          //Handle errors
          console.error("Error while initilizing BLE: " + obj.message);
        },
        function (obj) {
          //Handle successes
        }
      );
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('dash', {
        url: '/dash',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/dash');

  });




