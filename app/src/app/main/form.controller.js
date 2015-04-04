'use strict';

angular.module('gulu')
  .controller('FormCtrl', function ($scope, $http, $rootScope, $stateParams, $state, $cookieStore) {
    $scope.param = $stateParams.qid + $stateParams.demoid;
    $scope.question = $stateParams.q;
    console.log($scope.qData);
    var qIdCookie = $cookieStore.get('qIdCookie');
    var uidCookie = $cookieStore.get('uidCookie');
    var aSubmitted = $cookieStore.get('aSubmitted');
    $scope.qData = JSON.parse(JSON.stringify(qIdCookie));

    $http.get("http://takalam.me/api/comment/?qid="+qIdCookie).
      success(function(data, status, headers, config) {
        console.log($scope.param_qid);
        $scope.qData = data;
      }).
      error(function(data, status, headers, config) {
      });

        console.log(aSubmitted);
        console.log(uidCookie);
    if (aSubmitted == uidCookie ) {
        $scope.submitted = true;
    }

    $scope.submitComment = function(userID) {
    	$http({
            method: 'POST',
            url: "http://takalam.me/api/comment/?qid="+$stateParams.qid,
            data: $.param({uid:uidCookie, name:$scope.commentUser, comment:$scope.commentBody }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data, status, headers, config) {
    		$scope.submitted = true;
            $cookieStore.put('aSubmitted', uidCookie);
    		$scope.commentdecisionNew = $stateParams.d;
    		$scope.commentUserNew = $scope.commentUser;
    		$scope.commentBodyNew = $scope.commentBody;
            // $state.go('thanks');
          }).error(function(data, status, headers, config) {

          });
    }

  });

