recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state',  'locker', 'currentTransaction', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@$rootScope.currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'

    @$scope.defaultFrequency = 5
    @$scope.defaultInterval = "Year"

    @$scope.frequencyList = [
      {text: "Week", value: "week"},
      {text: "Month", value: "month"}
      {text: "Year", value: "year"},
    ]

  showSavings: ()=>
    transactionId = @$rootScope.currentTransaction.id ? '1'
    frequency = @$scope.frequency ? 4
    timePeriod = @$scope.timePeriod ? 'week'
    console.log 'ShowSavings'
    @User.getSavings(@$rootScope.session_token, transactionId, frequency, timePeriod).then( (result)=>
      console.log result
      @$rootScope.projections = result.data.savings_projection
      @locker.put 'projections', result.data.savings_projection
      @$state.go 'report'
    )
