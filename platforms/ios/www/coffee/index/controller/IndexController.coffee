app = angular.module 'narwhal'

class IndexController extends BaseController

  @register app
  @inject '$scope', '$http', '$state', '$rootScope',  'User', 'locker'

  initialize: ()=>
    @$scope.transactions = []
    @loadTransactions()
    if @locker.has 'session_token'
      @$rootScope.session_token = @locker.get 'session_token'

    if @locker.has 'transactions'
      @$scope.transactions = @locker.get 'transactions'

  logout: ()->
    @locker.forget('session_token')
    @$state.go 'login'

  refresh: ()->
    @loadTransactions()

  loadTransactions: ()=>
    if(!@$rootScope.session_token)
      @$state.go 'login'
      return;
    @User.getTransactions(@$rootScope.session_token).then (result)=>

      imgSrcs = {
        'Dining' : './img/food-icon.png',
        'Gas & Fuel' : './img/gas-icon.png',
        'Check' : '',
        'Bank Fee' : './img/bankfee-icon.png',
        'Auto Insurance' : './img/car-icon.png',
        'Auto Payment' : './img/car-icon.png',
        'Shopping' : './img/food-icon.png',
        'Groceries' : './img/food-icon.png',
        'Personal Care' : ''
      };

      transactions = []
      for transaction, i in result.data
        if i < result.data.length-1
          transaction.next = i+1
        else
          transaction.next = 0

        ///Set the img src///
        transaction.imgSrc = imgSrcs[transaction.categorization] || './img/bankfee-icon.png'
        transactions.push transaction

      @$scope.transactions = transactions
      @locker.put 'transactions', @$scope.transactions
      @$scope.$broadcast('scroll.refreshComplete')

  showTransaction: (transaction)->
    @$rootScope.currentTransaction = transaction
    @$state.go('recurring')

