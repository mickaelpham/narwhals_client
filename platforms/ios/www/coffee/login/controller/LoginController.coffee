loginModule = angular.module 'narwhal.login'

class LoginController extends BaseController

  @register loginModule
  @inject '$scope', '$http', '$state', 'User'

  login: ()=>
    @$scope.isLoading = true
    @User.login(@$scope.username, @$scope.password).then( ()=>
      @$scope.isLoading = false
      @$state.go 'index'
    )

  initialize: ()=>
    @$scope.username = ''
    @$scope.password = ''

