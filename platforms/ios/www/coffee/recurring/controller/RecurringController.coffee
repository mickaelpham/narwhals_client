recurringModule = angular.module 'narwhal.recurring'

class RecurringController extends BaseController

  @register recurringModule
  @inject '$scope', '$http', '$scope', '$stateParams', 'currentTransaction'

  initialize: ()->
    @$scope.hello = "World"
    @$scope.transaction = @currentTransaction
    Mi.motion.slideUp({
      selector: '.slide-up'
    })

