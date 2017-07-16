angular.module('bluetooth_wortex.controllers', [])

  .controller('DashCtrl', ['$scope', '$cordovaBluetoothLE', '$ionicPlatform', '$timeout', '$interval',
    function ($scope, $cordovaBluetoothLE, $ionicPlatform, $timeout, $interval) {
      // $scope.progressPercent = 0;
      $ionicPlatform.ready(function () {
        $scope.startRealScan();
      });
      $scope.runScan = function () {
        $scope.startRealScan();
      };
      $scope.runStopScan = function () {
        $scope.scanStop();
      };

      $scope.foundDevices = new Object;
      $scope.showResults = false;
      $scope.showError = false;

      function CheckIsEnabled() {
        $cordovaBluetoothLE.isEnabled().then(function (obj) {
          if (obj.isEnabled) {
            $scope.showResults = true;
            $scope.showError = false;
            $scope.scanStart()
          } else {
            $scope.showError = true;
          }
        }, function (error) {
          console.log("Error while checking enabled scanner " + error.message)
        })
      };

      $scope.startRealScan = function () {
        console.log("start check enable bluetooth");
        startIntervalCheck = $interval(CheckIsEnabled, 1000);
      };

      var log = function (msg, level) {
        level = level || "log";
        if (typeof msg === "object") {
          msg = JSON.stringify(msg, null, "  ");
        }
        console.log(msg);

      };

      $scope.handleError = function (error) {
        var msg;
        if (error.error && error.message) {
          var errorItems = [];
          if (error.service) {
            errorItems.push("service: " + (uuids[error.service] || error.service));
          }
          if (error.characteristic) {
            errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
          }
          msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
        }
        else {
          msg = error;
        }
        log(msg, "error");
        if (error.error === "read" && error.service && error.characteristic) {
          reportValue(error.service, error.characteristic, "Error: " + error.message);
        }
      };

      $scope.scanStart = function () {
        $cordovaBluetoothLE.startScan({services: []})
          .then(null, function (obj) {
              //Handle errors
//          $scope.handleError(obj);
              console.log('Error while scanning: ' + obj.message);
            }, function (obj) {
              $scope.startScanSuccess(obj);
              if (obj.status == "scanResult") {
                //Device found
                console.debug('Device found...');
              } else if (obj.status == "scanStarted") {
                //Scan started
                console.debug('Wait search devices...');
              }
            }
          )
      };
      $scope.scanStop = function () {
        $interval.cancel(startIntervalCheck);
        $scope.showResults = false;
        $scope.showError = false;
        $cordovaBluetoothLE.stopScan().then(null, function (obj) {
          if (obj.status == "scanStopped") {
            //Scan stopped
            console.log('Scanning stopped');
          } else console.log('Error with stopping blescan: ' + obj.message);

        });

      };

      $scope.startScanSuccess = function (result) {
        log("startScanSuccess(" + result.status + ")");
        console.debug(result);
        if (result.status === "scanStarted") {
          log("Scanning for devices (will continue to scan until you select a device)...", "status");
        } else if (result.status === "scanResult") {
          checkDevice(result);
        }
      };

      var checkDevice = function (device) {
        device.timeMark = new Date();
        if (device.address in $scope.foundDevices) {
          console.debug("It is not a new devise");
          $scope.foundDevices[device.address].push(device);
        } else {
          console.debug("It is a new devise!!!!");
          $scope.foundDevices[device.address] = [];
          $scope.foundDevices[device.address].push(device);
        }

        console.log($scope.foundDevices);
      };

    }]);




