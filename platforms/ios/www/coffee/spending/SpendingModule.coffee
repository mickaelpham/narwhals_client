spendingModule = angular.module('narwhal.spending', [])

spendingModule.config ($stateProvider)->
  $stateProvider
  .state('spending',
    url: '/spending/'
    templateUrl: 'templates/spending.html'
    controller: 'SpendingController'
    resolve:
      spending: ['$rootScope', ($rootScope)->
        console.log "Trying to resolve spending variable..."
        console.log $rootScope
        return $rootScope.spending
      ]
  )