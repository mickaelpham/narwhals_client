reportModule = angular.module 'narwhal.report'

class ReportController extends BaseController

  @register reportModule
  @inject '$scope', '$rootScope', 'locker'

  initialize: ()->
    if !@$rootScope.projections?
      if @locker.has 'projections'
        @$rootScope.projections = @locker.get 'projections'

    setTimeout( ()->
      Mi.motion.blindsDown({ selector: '.card'})
    , 500)
