'use strict';

angular.module('gulu')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $http.get('http://takalam.me/api/question/?qid=1').
      success(function(data, status, headers, config) {
        console.log(data);
        $rootScope.question = data.question;
      }).
      error(function(data, status, headers, config) {
      });
  });
