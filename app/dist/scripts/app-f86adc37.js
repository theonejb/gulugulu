"use strict";angular.module("gulu",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider",function(a,e){a.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("form",{url:"/form/:d/:q/:qid/:demoid/",templateUrl:"app/main/form.html",controller:"FormCtrl"}).state("thanks",{url:"/thanks/",templateUrl:"app/main/thanks.html",controller:"FormCtrl"}),e.otherwise("/")}]),angular.module("gulu").controller("NavbarCtrl",["$scope",function(a){a.date=new Date}]),angular.module("gulu").controller("MainCtrl",["$scope","$http","$rootScope","$state","$stateParams","$location",function(a,e,s,t,o,i){a.param_qid=i.search().qid,a.param_demoid=i.search().demoid,a.url="http://takalam.me/api/question/?qid="+a.param_qid+"&demoid="+a.param_demoid,e.get(a.url).success(function(e){a.question=e.question,a.sub_questions=e.sub_questions,console.log(a.sub_questions)}).error(function(){}),a.submitForm=function(o){var i=[];$('input[type="radio"]:checked').each(function(){i.push($(this).val())}),i=i.join(","),console.log(i),console.log("cldik"),e({method:"POST",url:a.url,data:$.param({response:o,sub_question_responses:i}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(e){s.qData=e,t.go("form",{d:o,q:a.question,qid:a.param_qid,demoid:a.param_demoid})}).error(function(){})}}]),angular.module("gulu").controller("FormCtrl",["$scope","$http","$rootScope","$stateParams","$state",function(a,e,s,t){a.param=t.qid+t.demoid,a.question=t.q,a.qData=s.qData,console.log(a.qData),a.submitComment=function(s){e({method:"POST",url:"http://takalam.me/api/comment/?qid="+t.qid,data:$.param({uid:s,name:a.commentUser,comment:a.commentBody}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(){a.submitted=!0,a.commentdecisionNew=t.d,a.commentUserNew=a.commentUser,a.commentBodyNew=a.commentBody}).error(function(){})}}]),angular.module("gulu").run(["$templateCache",function(a){a.put("app/main/form.html",'<div class="container"><div ng-include="\'components/navbar/navbar.html\'"></div><div class="well mbxl tr fsl f-ge">{{question}}</div><div class="col-xs-6"><div class="q-disagree"><div class="circle-num">{{qData.num_disagrees}}</div><div class="block">ضد</div></div></div><div class="col-xs-6"><div class="q-agree"><div class="circle-num">{{qData.num_agrees}}</div><div class="block">مع</div></div></div><div class="mtxl">&nbsp;</div><div class="row" ng-repeat="comment in qData.comments"><div class="col-sm-10"><div class="panel panel-default"><div class="panel-body bg-{{comment.response}}">{{comment.comment}}</div></div></div><div class="col-sm-2">Anynomus</div></div><div class="row" ng-if="submitted"><div class="col-sm-10"><div class="panel panel-default"><div class="panel-body bg-{{commentdecisionNew}}">{{commentBodyNew}}</div></div></div><div class="col-sm-2">{{commentUserNew}}</div></div><div class="row" ng-show="!submitted"><div class="col-sm-10"><div class="panel panel-default"><div class=""><textarea class="form-control" ng-model="commentBody"></textarea></div></div><button class="btn btn-primary" ng-click="submitComment(qData.uid)">Submit</button></div><div class="col-sm-2"><input type="text" placeholder="your name" class="form-control" ng-model="commentUser"></div></div><div class="footer"><p></p></div></div>'),a.put("app/main/main.html",'<div class="container"><div ng-include="\'components/navbar/navbar.html\'"></div><div class="q-bg" style="background: url(../assets/images/q{{param_qid}}.jpg) top center no-repeat;"></div><div class="well mbxl qestion-box"><div class="tr fsl f-ge main-qestion">{{question}}</div><form role="form" name="form" novalidate=""><div class="row tr f-ge" ng-repeat="(key, value) in sub_questions"><label class="control-label question">{{value}}</label><div class="col-sm-12"><div class="checkbox answers"><label><input type="radio" class="circle-check" name="sub_{{key}}" value="1" required=""> نعم</label> <label><input type="radio" class="circle-check" name="sub_{{key}}" value="0" required=""> لا</label></div></div></div></form></div><div class="row"><div class="center-block"><button class="btn btn-lg btn-danger mal" ng-click="submitForm(0)">ضد</button> <button class="btn btn-lg btn-success mal" ng-click="submitForm(1)">مع</button></div></div></div><div class="footer"><p></p></div>'),a.put("app/main/thanks.html",'<div class="container"><div ng-include="\'components/navbar/navbar.html\'"></div><div class="well mbxl tr fsl f-ge">thanks</div><div class="footer"><p></p></div></div>'),a.put("components/navbar/navbar.html",'<nav class="navbar navbar-static-top" ng-controller="NavbarCtrl"><div class="container-fluid"><div class="navbar-header tr"><a class="navbar-brand" ui-sref="home"><img src="/assets/images/takalam-logo.png" width="20%"></a></div></div></nav>')}]);