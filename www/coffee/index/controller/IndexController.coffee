app = angular.module 'narwhal'

class IndexController extends BaseController

  @register app
  @inject '$scope', '$http', '$state', '$rootScope'

  initialize: ()=>
    console.log this

  refresh: ()->
    @loadTransactions()
    @$scope.$broadcast('scroll.refreshComplete')
    setTimeout(Mi.motion.fadeSlideInRight({
      selector: '.list > *'
    }), 10)

  loadTransactions: ()=>
    @$scope.transactions = [
      {
        name: 'Arbys'
        amount: @getRandomAmount()
      }, {
        name: 'Au Bon Pain'
        amount: @getRandomAmount()

      }, {
        name: 'Buffalo Wild Wings'
        amount: @getRandomAmount()

      }, {
        name: 'Burger King'
        amount: @getRandomAmount()

      }, {
        name: 'Carls Jr.'
        amount: @getRandomAmount()

      }, {
        name: 'Dairy Queen'
        amount: @getRandomAmount()

      }, {
        name: 'Dominos Pizza'
        amount: @getRandomAmount()

      }, {
        name: 'Dunkin Donuts'
        amount: @getRandomAmount()

      }, {
        name: 'Hardees'
        amount: @getRandomAmount()

      }, {
        name: 'KFC'
        amount: @getRandomAmount()

      }, {
        name: 'Little Caesars'
        amount: @getRandomAmount()

      }, {
        name: 'Long John Silvers'
        amount: @getRandomAmount()

      }, {
        name: 'McCafé'
        amount: @getRandomAmount()

      }, {
        name: 'McDonalds'
        amount: @getRandomAmount()

      }, {
        name: 'Nandos'
        amount: @getRandomAmount()

      }, {
        name: 'Pizza Hut'
        amount: @getRandomAmount()

      }, {
        name: 'Round Table Pizza'
        amount: @getRandomAmount()

      }, {
        name: 'Sonic Drive-In'
        amount: @getRandomAmount()

      }, {
        name: 'Starbucks'
        amount: @getRandomAmount()

      }, {
        name: 'Subway'
        amount: @getRandomAmount()

      }, {
        name: 'TCBY'
        amount: @getRandomAmount()

      }, {
        name: 'Tim Hortons'
        amount: @getRandomAmount()

      }, {
        name: 'Taco Bell'
        amount: @getRandomAmount()

      }, {
        name: 'Wendys'
        amount: @getRandomAmount()

      }, {
        name: 'Wendys Supa Sundaes'
        amount: @getRandomAmount()

      }, {
        name: 'Whataburger'
        amount: @getRandomAmount()

      }, {
        name: 'White Castle'
        amount: @getRandomAmount()

      }, {
        name: 'Wingstop'
        amount: @getRandomAmount()
      },
      {
        name: 'WingStree'
        amount: @getRandomAmount()
      }
    ]

  getRandomAmount: ()=>
    return Math.floor(Math.random() * 5000) / 100

  showTransaction: (transaction)->
    @$rootScope.currentTransaction = transaction
    @$state.go('recurring')

