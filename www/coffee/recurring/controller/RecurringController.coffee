recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state', 'currentTransaction', '$ionicViewSwitcher'

  initialize: ()->
    if !@$rootScope.currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'
