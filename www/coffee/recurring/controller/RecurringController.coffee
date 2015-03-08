recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$ionicPlatform', '$rootScope', '$stateParams',  '$state',  '$window',  'locker', 'currentTransaction', 'User', '$ionicViewSwitcher', '$cordovaSpinnerDialog', '$timeout'

  initialize: ()->
    if !@currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'
    @choseBackgroundImage()
    @chooseIconImage()
    @calculateYearlySpending()
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
      @calculateYearlySpending()

  calculateYearlySpending: ()->
    if !@currentTransaction
      @$scope.yearlySpending = 0
      return
    @$scope.yearlySpending = @currentTransaction.amount
    if !@$scope.similarTransactions
      return
    for transaction in @$scope.similarTransactions
      @$scope.yearlySpending += transaction.amount

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
    @$scope.backgroundImage = bg

  chooseIconImage: ()->
    if !@currentTransaction
      @$scope.iconImage = 'bankfee-icon.png'
      return
    iconImage = 'bankfee-icon.png'
    switch @currentTransaction.categorization
      when 'Auto Payment' then iconImage = 'car-icon.png'
      when 'Gas & Fuel' then iconImage = 'gas-icon.png'
      when 'Check' then iconImage = 'bankfee-icon.png'
      when 'Shopping' then iconImage = 'food-icon.png'
      when 'Groceries' then iconImage = 'food-icon.png'
      when 'Bank Fee' then iconImage = 'bankfee-icon.png'
      when 'Personal Care' then iconImage = 'bankfee-icon.png'
      when 'Home Improvement' then iconImage = 'bankfee-icon.jpg'
      when 'Auto Insurance' then iconImage = 'car-icon.png'
    @$scope.iconImage = iconImage;

  loadSimilar: ()=>
    @$scope.loadingSimilar = true
    if !@currentTransaction
      return
    @User.getSimilarTransactions(@$rootScope.session_token, @currentTransaction.id).then (result)=>
      @$scope.similarTransactions = result.data
      @$scope.loadingSimilar = false
      @calculateYearlySpending()

  showSavings: ()=>
    @$ionicPlatform.ready ()=>
      transactionId = @currentTransaction.id ? '1'
      frequency = @$scope.frequency ? 4
      timePeriod = @$scope.timePeriod ? 'week'
      console.log 'ShowSavings'

      if @$window.plugins && @$window.plugins.spinnerDialog
        @$cordovaSpinnerDialog.show("Calculating","crunching numbers...", true);

      @User.getSavings(@$rootScope.session_token, transactionId, frequency, timePeriod).then( (result)=>
        console.log result
        @$rootScope.projections = result.data.savings_projection
        @locker.put 'projections', result.data.savings_projection
        @$rootScope.spending = result.data.cost
        console.log result.data
        if @$window.plugins && @$window.plugins.spinnerDialog
          @$timeout( ()=>

            @$cordovaSpinnerDialog.hide()
            @$state.go 'spending'
          , 3000
          )
        else
          @$state.go 'spending'
      )
