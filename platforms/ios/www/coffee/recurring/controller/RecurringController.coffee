recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state',  'locker', 'User', '$ionicViewSwitcher'

  initialize: ()->
<<<<<<< HEAD
    if !@currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'

  showSavings: ()=>
=======
    @currentTransaction = @$rootScope.currentTransaction
    if !@currentTransaction

      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'

    @$scope.defaultFrequency = 5
    @$scope.defaultInterval = "Year"

    @$scope.frequencyList = [
      {text: "Week", value: "week"},
      {text: "Month", value: "month"}
      {text: "Year", value: "year"},
    ]

  showNext: ()=>
    console.log "Swipped left!"

  showSavings: ()=>
    @currentTransaction = @$rootScope.currentTransaction
>>>>>>> feature(Spending): add new screen
    transactionId = @currentTransaction.id ? '1'
    frequency = @$scope.frequency ? 4
    timePeriod = @$scope.timePeriod ? 'week'
    console.log 'ShowSavings'
    @User.getSavings(@$rootScope.session_token, transactionId, frequency, timePeriod).then( (result)=>
      console.log result
      @$rootScope.projections = result.data.savings_projection
      @locker.put 'projections', result.data.savings_projection
      @$rootScope.spending = result.data.cost
      console.log "....got spending"
      console.log @$rootScope.cost
      @$state.go 'spending'
    )
