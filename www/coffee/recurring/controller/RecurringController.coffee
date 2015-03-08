recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state',  'locker', 'currentTransaction', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'
    @choseBackgroundImage()
    @loadSimilar()

  showNext: ()->
    transactions = @locker.get 'transactions'
    if !@currentTransaction
      return
    nextTransaction =  transactions[@currentTransaction.next]
    if nextTransaction
      @currentTransaction = nextTransaction
      @$rootScope.currentTransaction = @currentTransaction
      @$scope.isRecurring = false
      @loadSimilar()
      @choseBackgroundImage()

  choseBackgroundImage: ()->
    if !@currentTransaction
      @$scope.backgroundImage = 'unknown.jpg'
      return
    bg = 'unknown.jpg'
    switch @currentTransaction.categorization
      when 'Unknown' then bg = 'unknown.jpg'
      when 'Uncategorized' then bg = 'unknown.jpg'
      when 'Auto Payment' then bg = 'unknown.jpg'
      when 'Gas & Fuel' then bg = 'gas.jpg'
      when 'Check' then bg = 'check.jpg'
      when 'Shopping' then bg = 'shopping.jpg'
      when 'Groceries' then bg = 'groceries.jpg'
      when 'Bank Fee' then bg = 'atm.jpg'
      when 'Personal Care' then bg = 'personalcare.jpg'
      when 'Home Improvement' then bg = 'home-improvement.jpg'
      when 'Auto Insurance' then bg = 'car-insurance.jpg'
    console.log  @currentTransaction.categorization
    @$scope.backgroundImage = bg

  loadSimilar: ()=>
    @$scope.loadingSimilar = true
    if !@currentTransaction
      return
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
