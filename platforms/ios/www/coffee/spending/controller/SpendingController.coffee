spendingModule = angular.module 'narwhal.spending'

class SpendingController extends BaseController

  @register spendingModule
  @inject '$scope',  '$state', 'spending', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@spending
      @spending = 147320
    console.log @spending

