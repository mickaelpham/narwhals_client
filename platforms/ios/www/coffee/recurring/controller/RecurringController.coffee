recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state', 'currentTransaction', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@$rootScope.currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'

  showSavings: ()->
    transactionId = @$rootScope.currentTransaction.co_transaction_id ? '1410479940000'
    frequency = @$scope.frequency ? 4
    timePeriod = @$scope.timePeriod ? 'week'
    console.log 'ShowSavings'
    @User.getSavings(@$rootScope.session_token, transactionId, frequency, timePeriod).then( (result)->
      console.log result
    )