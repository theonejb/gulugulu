'use strict';

angular.module('gulu', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('form', {
        url: '/form/:d/:q/:qid/:demoid/',
        templateUrl: 'app/main/form.html',
        controller: 'FormCtrl'
      }).state('thanks', {
        url: '/thanks/',
        templateUrl: 'app/main/thanks.html',
        controller: 'FormCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
