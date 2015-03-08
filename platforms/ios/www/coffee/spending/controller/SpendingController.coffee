spendingModule = angular.module 'narwhal.spending'

class SpendingController extends BaseController

  @register spendingModule
  @inject '$scope',  '$state', 'spending', '$rootScope', 'User', '$ionicViewSwitcher'

  initialize: ()->
    if !@spending
      @spending = @$rootScope.spending
    @$scope.spending = @spending
    console.log @spending


