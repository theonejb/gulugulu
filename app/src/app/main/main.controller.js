'use strict';

angular.module('gulu')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $state, $stateParams, $location, $cookieStore) {
    $scope.param_qid= $location.search()['qid'];
    $scope.param_demoid= $location.search()['demoid'];
    $scope.url= "http://takalam.me/api/question/?qid="+$scope.param_qid+"&demoid="+$scope.param_demoid;
    $http.get($scope.url).
      success(function(data, status, headers, config) {
        $scope.question = data.question;
        $scope.sub_questions = data.sub_questions;
        $scope.allow_comments = data.allow_comments;
        $cookieStore.put('qIdCookie', $scope.param_qid)
        console.log($scope.param_qid);
      }).
      error(function(data, status, headers, config) {
      });


      $scope.submitForm =  function (decision) {  
        var allAnswer = [];
        $('input[type="radio"]:checked').each(function() {
          allAnswer.push($(this).val());
        });
        allAnswer = allAnswer.join(',');
        $http({
            method: 'POST',
            url: $scope.url,
            data: $.param({response:decision, sub_question_responses: allAnswer }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).success(function(data, status, headers, config) {
            $rootScope.qData = data;
            $cookieStore.put('uidCookie', $rootScope.qData.uid)
            // flag for discussion
            if ($scope.allow_comments) {
              $state.go('form', {d:decision, q:$scope.question, qid:$scope.param_qid,demoid:$scope.param_demoid});
            } else {
              $state.go('thanks');
            }
          }).error(function(data, status, headers, config) {
        });
        

        //console.log('clicked');
        // check for error
        // $scope.hasError = function(field, validation){
        //   if(validation){
        //     return ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.submitted && $scope.form[field].$error[validation]);
        //   }
        //     return ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.submitted && $scope.form[field].$invalid);
        // };

        // if valid submit data to db
        // if (isValid) {}
          //console.log('if valid');
          

        }

  });
