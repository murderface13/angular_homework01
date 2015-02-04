'use strict';

var ws = new WebSocket("ws://f2.smartjs.academy/ws");

/* Controllers */

var homeworkControllers = angular.module('homework', []);

homeworkControllers.controller('UsersListCtrl', ['$scope','$http','$filter',
  function($scope, $http, $filter) {
    $scope.dataa = "ololoshechki!";
    $http.get('http://f2.smartjs.academy/list').
      success(function (dataFromServer) {
        $scope.users = dataFromServer;
    });

    $scope.text = '';

    $scope.change_pos = function(item){
      item.inHall = !item.inHall;
      ws.send(JSON.stringify({
        action: 'update',
        guest: item
      }));
    }

    $scope.destroy_guest = function(item) {
      $scope.users.splice($scope.users.indexOf(item),1)
      ws.send(JSON.stringify({
        action: 'remove',
        id: item.id
      }));
    }

    $scope.create_guest = function(){
      var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });

      var valName = $scope.text; 
      var guest = {
        id: id,
        name: valName,
        inHall: false
      };

      $scope.users.push(guest);
      ws.send(JSON.stringify({
        action: 'add',
        guest: guest
      }));
      return false;
    };

    ws.onmessage = function(evt){

      if (JSON.parse(evt.data).action === "add"){
        var addGuest = {
          id: JSON.parse(evt.data).guest.id,
          name: JSON.parse(evt.data).guest.name,
          inHall: JSON.parse(evt.data).guest.inHall
        };
        $scope.users.push(addGuest);
      }

      if (JSON.parse(evt.data).action === "remove") {
        var removeGuest = JSON.parse(evt.data).id;
        $scope.users = $filter('filter')($scope.users, {id: '!'+removeGuest})
      }

      if (JSON.parse(evt.data).action === "update") {
        var updateGuest = {
          id: JSON.parse(evt.data).guest.id,
          name: JSON.parse(evt.data).guest.name,
          inHall: JSON.parse(evt.data).guest.inHall
        }

        for(var i = 0 in $scope.users) {
          if($scope.users[i].id == updateGuest.id) {
            $scope.users[i] = updateGuest;
            break;
          }
        }
      }

      $scope.$apply();
      
    };
  }]);