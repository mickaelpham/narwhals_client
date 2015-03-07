app = angular.module 'narwhal'

class IndexController extends BaseController

  @register app
  @inject '$scope', '$http', '$state', '$rootScope',  'User', '$ionicNavBarDelegate', 'locker'

  initialize: ()=>
    @$scope.transactions = []
    result = @$ionicNavBarDelegate.showBackButton (false)
    @loadTransactions()
    if @locker.has 'session_token'
      @$rootScope.session_token = @locker.get 'session_token'

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

  getRandomAmount: ()=>
    return Math.floor(Math.random() * 5000) / 100

  showTransaction: (transaction)->
    console.log "Current Transaction"
    console.log transaction
    @$rootScope.currentTransaction = transaction
    @$state.go('recurring')

