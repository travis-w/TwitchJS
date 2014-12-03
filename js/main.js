'use strict';

var twitchJS = angular.module('twitchJS', []);

twitchJS.factory('storageService', function ($rootScope) {
    return { 
        get: function (key) {
           return localStorage.getItem(key);
        },

        save: function (key, data) {
           localStorage.setItem(key, JSON.stringify(data));
        },

        remove: function (key) {
            localStorage.removeItem(key);
        },
        
        clearAll : function () {
            localStorage.clear();
        }
    };
});

twitchJS.factory('cacheService', function ($http, storageService) {
    
    return {
        
        getData: function (key) {
            return storageService.get(key);
        },

        setData: function (key,data) {
            storageService.save(key, data);
        },
        
        removeData: function (key) {
            storageService.remove(key);
        }
    };
});

//Conroller for Commands
twitchJS.controller('commandCntrl', ['$scope', 'cacheService', function ($scope, cacheService) {    
    //Grab saved commands from localstorage
    $scope.saved = JSON.parse(JSON.parse(cacheService.getData('twitchjs-commands')));

    $scope.commands = (cacheService.getData('twitchjs-commands')!==null) ? $scope.saved : [{ trigger: '!TwitchJS', response: 'This bot is powered by TwitchJS' }];
    
    //Remove command 
    $scope.removeCommand = function(index) {
        $scope.commands.splice(index, 1);  
    };
    
    //Add command
    $scope.addCommand = function() {
        $scope.commands.push({ trigger: '', response: '' });
    };
    
    //Save commands to localstorage
    $scope.saveCommands = function() {
        cacheService.setData('twitchjs-commands', JSON.stringify($scope.commands));
    };
    
}]);

//Controller for Intervals
twitchJS.controller('intervalCntrl', ['$scope', 'cacheService', function ($scope, cacheService) {
    //Grab saved intervals from localstorage
    $scope.saved = JSON.parse(JSON.parse(cacheService.getData('twitchjs-intervals')));

    $scope.intervals = (cacheService.getData('twitchjs-intervals')!==null) ? $scope.saved : [{ time: 10, text: 'This is an interval at 10 seconds' }];
        
    //Remove interval
    $scope.removeInterval = function(index) {
        $scope.intervals.splice(index, 1);  
    };
    
    //Add interval
    $scope.addInterval = function() {
        $scope.intervals.push({ trigger: '', response: '' });
    };
    
    //Save intervals to localstorage
    $scope.saveIntervals = function() {
        cacheService.setData('twitchjs-intervals', JSON.stringify($scope.intervals));
    };
    
}]);