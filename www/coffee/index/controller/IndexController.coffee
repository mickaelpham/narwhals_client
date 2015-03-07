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
      ionic.DomUtil.ready( ()->
        Mi.motion.fadeSlideInRight({selector: '.animate-fade-slide-in-right > *'})
      )
      
  logout: ()->
    @locker.forget('session_token')
    @$state.go 'login'

  refresh: ()->
    @loadTransactions()
    @$scope.$broadcast('scroll.refreshComplete')
    setTimeout(Mi.motion.fadeSlideInRight({
      selector: '.animate-fade-slide-in-right > *'
    }), 10)

  loadTransactions: ()=>
    @User.getTransactions(@$rootScope.session_token).then (result)=>
      @$scope.transactions = result.data
      @locker.put 'transactions', @$scope.transactions

  getRandomAmount: ()=>
    return Math.floor(Math.random() * 5000) / 100

  showTransaction: (transaction)->
    console.log "Current Transaction"
    console.log transaction
    @$rootScope.currentTransaction = transaction
    @$state.go('recurring')

