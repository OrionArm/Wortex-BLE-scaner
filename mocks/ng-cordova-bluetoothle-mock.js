// install  :     cordova plugin add https://github.com/randdusing/cordova-plugin-bluetoothle.git
// link     :     https://github.com/randdusing/cordova-plugin-bluetoothle

angular.module('ngCordovaBluetoothLE', [])
  .factory('$cordovaBluetoothLE', ['$q', '$timeout', '$interval', function ($q, $timeout, $interval) {
    var errorUnsupported = {
      error: "unsupported",
      message: "Operation unsupported"
    };

    /*
     -110dB - -30dB
     0%      100%
     */
    var BLE_DEVICE = [
      {
        "status": "scanResult",
        "advertisement": "awArG05L", //Android
        "advertisement": { //iOS
          "serviceUuids": [
            "180D"
          ],
          "manufacturerData": "awAvFFZY",
          "txPowerLevel": 0,
          "overflowServiceUuids": [],
          "isConnectable": true,
          "solicitedServiceUuids": [],
          "serviceData": {},
          "localName": "Polar H7 3B321015"
        },
        "rssi": -58,
        "name": "Sony Xperia Z1 compact",
        "address": "TCC037FD-22AE-AFC5-9314-CA785B3B5C80"
      },
      {
        "status": "scanResult",
        "advertisement": "awArG05L", //Android
        "advertisement": { //iOS
          "serviceUuids": [
            "180D"
          ],
          "manufacturerData": "awAvFFZY",
          "txPowerLevel": 0,
          "overflowServiceUuids": [],
          "isConnectable": true,
          "solicitedServiceUuids": [],
          "serviceData": {},
          "localName": "Polar H7 3B321015"
        },
        "rssi": -22,
        "name": "Iphone 7",
        "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
      }
    ];


    var unimplemented = function () {
      var q = $q.defer();
      q.reject(errorUnsupported);
      return q.promise;
    };

    var initialize = function (params) {
      var q = $q.defer();
      $timeout(function () {
        q.notify({});
      }, 1000);
      return q.promise;
    };

    var enable = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.enable(
          null,
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var disable = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.disable(
          null,
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };
    var scanInterval = null;

    var startScan = function (params) {
      var q = $q.defer();
      var timeout = null;
      if (params && params.scanTimeout) {
        timeout = $timeout(function () {
            $interval.cancel(scanInterval)
            scanInterval = null;
          }, params.scanTimeout
        );
      }
      if (scanInterval != null) {
        $interval.cancel(scanInterval);
      }
      scanInterval = $interval(function () {
        var device = BLE_DEVICE[Math.round(Math.random())];
        device.rssi = Math.round(80 * Math.random() - 110);
        q.notify(device);
      }, 500)

      return q.promise;
    };

    var stopScan = function () {
      if (scanInterval != null) {
        $interval.cancel(scanInterval);
      }
      var q = $q.defer();
      $timeout(function () {
        q.resolve({});
      }, 500);
      return q.promise;
    };

    var retrieveConnected = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.retrieveConnected(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };


    var bond = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.bond(
          function (obj) {
            $timeout.cancel(timeout);
            q.notify(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var unbond = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.unbond(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var connect = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.connect(
          function (obj) {
            $timeout.cancel(timeout);
            if (params && params.useResolve) {
              q.resolve(obj);
            } else {
              q.notify(obj);
            }
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var reconnect = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.reconnect(
          function (obj) {
            $timeout.cancel(timeout);
            if (params && params.useResolve) {
              q.resolve(obj);
            } else {
              q.notify(obj);
            }
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var disconnect = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.disconnect(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var close = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.close(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var discover = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.discover(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var services = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.services(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var characteristics = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.characteristics(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var descriptors = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.descriptors(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var read = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.read(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var subscribe = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.subscribe(
          function (obj) {
            $timeout.cancel(timeout);
            q.notify(obj);

            if (params && params.subscribeTimeout && obj.status == "subscribed") {
              $timeout(function () {
                window.bluetoothle.unsubscribe(
                  function (obj) {
                    q.resolve(obj);
                  },
                  function (obj) {
                    q.reject(obj);
                  },
                  params
                );
              }, params.subscribeTimeout);
            }
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var unsubscribe = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.unsubscribe(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var write = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.write(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var writeQ = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.writeQ(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var readDescriptor = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.readDescriptor(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var writeDescriptor = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.writeDescriptor(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var rssi = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.rssi(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var mtu = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.mtu(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var requestConnectionPriority = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        var timeout = createTimeout(params, q);

        window.bluetoothle.requestConnectionPriority(
          function (obj) {
            $timeout.cancel(timeout);
            q.resolve(obj);
          },
          function (obj) {
            $timeout.cancel(timeout);
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };


    var isInitialized = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isInitialized(
          function (obj) {
            q.resolve(obj);
          }
        );
      }
      return q.promise;
    };

    var isEnabled = function () {
      return $q.when({isEnabled: true});

    };

    var isScanning = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isScanning(
          function (obj) {
            q.resolve(obj);
          }
        );
      }
      return q.promise;
    };

    var isBonded = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isBonded(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var wasConnected = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.wasConnected(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var isConnected = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isConnected(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var isDiscovered = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isDiscovered(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };


    var hasPermission = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.hasPermission(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var requestPermission = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.requestPermission(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var isLocationEnabled = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isLocationEnabled(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var requestLocation = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.requestLocation(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };


    var initializePeripheral = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.initializePeripheral(
          function (obj) {
            q.notify(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var addService = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.addService(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var removeService = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.removeService(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var removeAllServices = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.removeAllServices(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var startAdvertising = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.startAdvertising(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var stopAdvertising = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.stopAdvertising(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var isAdvertising = function () {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.isAdvertising(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          }
        );
      }
      return q.promise;
    };

    var respond = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.respond(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var notify = function (params) {
      var q = $q.defer();
      if (window.bluetoothle === undefined) {
        q.reject(errorUnsupported);
      } else {
        window.bluetoothle.notify(
          function (obj) {
            q.resolve(obj);
          },
          function (obj) {
            q.reject(obj);
          },
          params
        );
      }
      return q.promise;
    };

    var encodedStringToBytes = function (value) {
      if (window.bluetoothle === undefined) {
        return;
      }
      return window.bluetoothle.encodedStringToBytes(value);
    };

    var bytesToEncodedString = function (value) {
      if (window.bluetoothle === undefined) {
        return;
      }
      return window.bluetoothle.bytesToEncodedString(value);
    };

    var stringToBytes = function (value) {
      if (window.bluetoothle === undefined) {
        return;
      }
      return window.bluetoothle.stringToBytes(value);
    };

    var bytesToString = function (value) {
      if (window.bluetoothle === undefined) {
        return;
      }
      return window.bluetoothle.bytesToString(value);
    };

    var bytesToHex = function (value) {
      if (window.bluetoothle === undefined) {
        return;
      }
      return window.bluetoothle.bytesToHex(value);
    };

    var createTimeout = function (params, q) {
      if (params && params.timeout) {
        return $timeout(function () {
          params.error = "timeout";
          q.reject(params);
        }, params.timeout);
      }
      return null;
    };

    return {
      initialize: initialize,
      enable: unimplemented,
      disable: unimplemented,
      startScan: startScan,
      stopScan: stopScan,
      retrieveConnected: unimplemented,

      bond: unimplemented,
      unbond: unimplemented,
      connect: unimplemented,
      reconnect: unimplemented,
      disconnect: unimplemented,
      close: unimplemented,
      discover: unimplemented,
      services: unimplemented,
      characteristics: unimplemented,
      descriptors: unimplemented,
      read: unimplemented,
      subscribe: unimplemented,
      unsubscribe: unimplemented,
      write: unimplemented,
      writeQ: unimplemented,
      readDescriptor: unimplemented,
      writeDescriptor: writeDescriptor,
      rssi: unimplemented,
      mtu: unimplemented,
      requestConnectionPriority: unimplemented,

      isInitialized: unimplemented,
      isEnabled: isEnabled,
      isScanning: unimplemented,
      isBonded: unimplemented,
      wasConnected: unimplemented,
      isConnected: unimplemented,
      isDiscovered: unimplemented,

      hasPermission: unimplemented,
      requestPermission: unimplemented,
      isLocationEnabled: unimplemented,
      requestLocation: unimplemented,

      initializePeripheral: unimplemented,
      addService: unimplemented,
      removeService: unimplemented,
      removeAllServices: unimplemented,
      startAdvertising: unimplemented,
      stopAdvertising: unimplemented,
      isAdvertising: unimplemented,
      respond: unimplemented,
      notify: unimplemented,

      encodedStringToBytes: unimplemented,
      bytesToEncodedString: unimplemented,
      stringToBytes: unimplemented,
      bytesToString: unimplemented,
      bytesToHex: unimplemented
    };
  }]);
