recurringModule = angular.module('narwhal.recurring', [])

recurringModule.config ($stateProvider)->
  $stateProvider
  .state('recurring',
    url: '/recurring/'
    templateUrl: 'templates/recurring.html'
    controller: 'RecurringController'
    resolve:
      currentTransaction: ['$rootScope', ($rootScope)->
        return $rootScope.currentTransaction
      ]
  )