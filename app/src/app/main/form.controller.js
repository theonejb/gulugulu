'use strict';

angular.module('gulu')
  .controller('FormCtrl', function ($scope, $http, $rootScope, $stateParams) {
    $scope.param = $stateParams.qid + $stateParams.demoid;
    $scope.question = $stateParams.q;
    $scope.qData = $rootScope.qData;
    console.log($scope.qData);
  });
