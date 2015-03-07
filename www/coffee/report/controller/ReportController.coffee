reportModule = angular.module 'narwhal.report'

class ReportController extends BaseController

  @register reportModule
  @inject '$scope'

  initialize: ()->
    @$scope.reports = [{
      name:'MyReport'
    }]
    setTimeout( ()->
      Mi.motion.blindsDown({ selector: '.card'})
    , 500)
