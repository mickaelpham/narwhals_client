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
        if !$rootScope.spending
          $rootScope.spending = -1896543300
        console.log "Done. Spending."
        return $rootScope.spending
      ]
  )