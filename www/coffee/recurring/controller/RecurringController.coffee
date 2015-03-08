recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$rootScope', '$stateParams',  '$state', 'currentTransaction', '$ionicViewSwitcher'

  initialize: ()->
    if !@$rootScope.currentTransaction
      @$ionicViewSwitcher.nextDirection 'back'
      @$state.go 'index'

    @$scope.defaultFrequency = 5
    @$scope.defaultInterval = "Year"

    @$scope.frequencyList = [
        {text: "Year", value: "Year"},
        {text: "Month", value: "Month"}
    ]
