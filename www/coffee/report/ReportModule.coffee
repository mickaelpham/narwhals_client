reportModule = angular.module('narwhale.report', [])

reportModule.config ($stateProvider)->
  $stateProvider
  .state('report',
    url: '/report/'
    templateUrl: 'templates/report.html'
    controller: 'ReportController'
  )