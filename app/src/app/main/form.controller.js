'use strict';

angular.module('gulu')
  .controller('FormCtrl', function ($scope, $http, $rootScope, $stateParams, $state) {
    $scope.param = $stateParams.qid + $stateParams.demoid;
    $scope.question = $stateParams.q;
    $scope.qData = $rootScope.qData;
    console.log($scope.qData);

    $scope.submitComment = function(userID) {
    	$http({
            method: 'POST',
            url: "http://takalam.me/api/comment/?qid="+$stateParams.qid,
            data: $.param({uid:userID, name:$scope.commentUser, comment:$scope.commentBody }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data, status, headers, config) {
    		$scope.submitted = true;
    		$scope.commentdecisionNew = $stateParams.d;
    		$scope.commentUserNew = $scope.commentUser;
    		$scope.commentBodyNew = $scope.commentBody;
            // $state.go('thanks');
          }).error(function(data, status, headers, config) {

          });
    }

  });
