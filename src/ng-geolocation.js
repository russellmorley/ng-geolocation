(function() {
  'use strict';

function geolocationService($rootScope, $window, $q, message_types, messages) {

    var hasGeo = false;
    var deferred = $q.defer();

    if($window.navigator && $window.navigator.geolocation){
        hasGeo = true;
    } else {
        $rootScope.$broadcast(message_types['error'], messages['error.unsupportedBrowser']);
    }

    var getErrorMessage = function (error) {
        var msg = null;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                msg = 'error.permissionDenied';
                break;
            case error.POSITION_UNAVAILABLE:
                msg = 'error.positionUnavailable';
                break;
            case error.TIMEOUT:
                msg = 'error.timeout';
                break;
            case error.UNKNOWN_ERROR:
                msg = 'error.unknown';
                break;
            default:
                msg = 'error.unkownerrorcode';
                break;
        };
        return messages[msg];
    };

    var errorCallbackDeferred = function (error) {
        var message = getErrorMessage(error);
        _deferred.reject(message);
    };
       
    var errorCallbackBroadcast = function(error) {
        var message = getErrorMessage(error);
        $rootScope.$broadcast(message_types['error'], message);
    };

    return {
        getCurrentPosition: function(options){
            if(!hasGeo){
                return deferred.reject();
            };
            $window.navigator.geolocation.getCurrentPosition(function(position) {
                deferred.resolve(position); 
            }, errorCallbackDeferred, options);
            return deferred.promise;
        },
        watchPosition: function(options){
            if(!hasGeo){
                $rootScope.$broadcast(message_types['error'], messages['error.unsupportedBrowser']);                
            };
            if (watchId) {
                    
            }
            watchId = $window.navigator.geolocation.watchPosition(function(position){
                $rootScope.$broadcast(message_types['success.positionupdate'], position);
            }, errorCallbackBroadcast, options);
            return watchId
        },
        clearWatch: function(watchId){
            $window.navigator.geolocation.clearWatch(watchId);
        }
    };
}

  angular.module('geolocationservice', [])
    .constant('messages', {
        'error.unsupportedBrowser':'Your browser does not support location services',
        'error.permissionDenied':'You have not allowed this application to access your location.',
        'error.positionUnavailable':'Cannot determine your location',
        'error.timeout':'An attempt to determine your location timed out.',
        'error.unknown': 'An unknown error occurred.',
        'error.unkownerrorcode': 'An error was received but its code was not recognized.',
        'warn.nowatchid':'Attempting to clear a watch position but position is not being watched'
     })
    .constant('message_types', {
        'error':'geo_error',
        'warn': 'geo_warn',
        'success.positionupdate': 'geo_positionupdate'
     })
    .factory('GeolocationService', geolocationService);
})();
