recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state',  'locker', 'currentTransaction', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'

  loadSimilar: ()->
    @scope.similarTransactions = [
      { amount: 12385232, transaction_time: '2014-03-05' },
      { amount: 69385232, transaction_time: '2014-07-05' },
      { amount: 85212332, transaction_time: '2014-09-09' },
      { amount: 38125232, transaction_time: '2014-09-25' },
      { amount: 52123832, transaction_time: '2014-09-15' },
    ]

  showSavings: ()=>
    transactionId = @currentTransaction.id ? '1'
    frequency = @$scope.frequency ? 4
    timePeriod = @$scope.timePeriod ? 'week'
    console.log 'ShowSavings'
    @User.getSavings(@$rootScope.session_token, transactionId, frequency, timePeriod).then( (result)=>
      console.log result
      @$rootScope.projections = result.data.savings_projection
      @locker.put 'projections', result.data.savings_projection
      @$state.go 'spending'
    )
