reportModule = angular.module 'narwhal.report'

class ReportController extends BaseController

  @register reportModule
  @inject '$scope'

  initialize: ()->
    setTimeout( ()->
      Mi.motion.blindsDown({ selector: '.card'})
    , 500)
