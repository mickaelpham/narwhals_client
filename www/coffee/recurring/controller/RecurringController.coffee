recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state',  'locker', 'currentTransaction', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'
    @loadSimilar()

  loadSimilar: ()=>
    @$scope.loadingSimilar = true
    @User.getSimilarTransactions(@$rootScope.session_token, @currentTransaction.id).then (result)=>
      @$scope.similarTransactions = result.data
      @$scope.loadingSimilar = false

  showSavings: ()=>
    transactionId = @currentTransaction.id ? '1'
    frequency = @$scope.frequency ? 4
    timePeriod = @$scope.timePeriod ? 'week'
    console.log 'ShowSavings'
    @User.getSavings(@$rootScope.session_token, transactionId, frequency, timePeriod).then( (result)=>
      console.log result
      @$rootScope.projections = result.data.savings_projection
      @locker.put 'projections', result.data.savings_projection
      @$rootScope.spending = result.data.cost
      console.log result.data
      @$state.go 'spending'
    )
