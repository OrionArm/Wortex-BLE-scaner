angular.module('starter.controllers', [])

  .controller('DashCtrl', ['$scope', '$cordovaBluetoothLE', '$ionicPlatform', '$timeout', function (
     $scope, $cordovaBluetoothLE, $ionicPlatform, $timeout) {
    // $scope.progressPercent = 0;
    $ionicPlatform.ready(function () {
    $scope.scanStart();
    });

    $scope.data = [
      {'Name':'sony xperia z1', 'UUID': 123456, 'RSSI': 40},
      {'Name':'Iphone', 'UUID': 123456, 'RSSI': 20},
      {'Name':'sony xperia z3', 'UUID': 123456, 'RSSI': 100},
      {'Name':'Iphone 2', 'UUID': 123456, 'RSSI': 100},
      {'Name':'Samsung', 'UUID': 123456, 'RSSI': 100},
      {'Name':'Nokia', 'UUID': 123456, 'RSSI': 100},
      {'Name':'Vasia', 'UUID': 123456, 'RSSI': 100},

    ];
    $scope.foundDevices = [];

    startScanSuccess = function (result) {
        log("startScanSuccess(" + result.status + ")");
         console.debug(result);
        if (result.status === "scanStarted") {
            log("Scanning for devices (will continue to scan until you select a device)...", "status");
        }
        else if (result.status === "scanResult") {
            if (!foundDevices.some(function (device) {
                return device.address === result.address;
            })) {
                log('FOUND DEVICE:');
                log(result);
                $scope.foundDevices.push(result);
//                addDevice(result.name, result.address);
            }
        }
    }
   log = function (msg, level) {
        level = level || "log";
        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, "  ");
        }
        console.log(msg);

    }
   handleError = function (error) {
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
   }

   $scope.scanStart = function () {
       $timeout($scope.scanStop, 5000);
       $cordovaBluetoothLE.startScan(startScanSuccess, handleError, {services: []})
       .then(null, function (obj) {
          //Handle errors
          handleError(obj);
          console.log('Error while scanning: ' + obj.message);
       },
       function (obj) {
          startScanSuccess(obj);
          if (obj.status == "scanResult") {
               //Device found
               console.debug('Device found...');

          } else if (obj.status == "scanStarted") {
               //Scan started
               console.debug('Wait search devices...');
          }
       })

    };
   $scope.scanStop = function () {
        $cordovaBluetoothLE.stopScan().then(null, function (obj) {
            if (obj.status == "scanStopped") {
                //Scan stopped
                  console.debug('Scanning stopped');
            } else console.log('Error with stopping blescan: ' + obj.message);

        });

   };



  }])




