'use strict';

angular.module('gulu')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $state, $stateParams, $location) {
    $scope.param_qid= $location.search()['qid'];
    $scope.param_demoid= $location.search()['demoid'];
    $scope.url= "http://takalam.me/api/question/?qid="+$scope.param_qid+"&demoid="+$scope.param_demoid;
    $http.get($scope.url).
      success(function(data, status, headers, config) {
        $scope.question = data.question;
        $scope.sub_questions = data.sub_questions;
        console.log($scope.sub_questions );
      }).
      error(function(data, status, headers, config) {
      });


      $scope.submitForm =  function (decision) {  
        var allAnswer = [];
        $('input[type="radio"]:checked').each(function() {
          allAnswer.push($(this).val());
        });
        allAnswer = allAnswer.join(',');
        
        console.log(allAnswer);
        console.log("cldik");
        $http({
            method: 'POST',
            url: $scope.url,
            data: $.param({response:decision, sub_question_responses: allAnswer }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $rootScope.qData = data;
            $state.go('form', {d:decision, q:$scope.question, qid:$scope.param_qid,demoid:$scope.param_demoid});
          }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // $state.go('form', {q:$scope.question,id:"12",demoid:"444"});
            // or server returns response with an error status.
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
