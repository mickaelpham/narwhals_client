loginModule = angular.module('narwhal.login', [])

loginModule.config ($stateProvider)->
  $stateProvider
  .state('login',
    url: '/login/'
    templateUrl: 'templates/login.html'
    controller: 'LoginController'
  )