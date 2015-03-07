loginModule = angular.module 'narwhal.login'

class LoginController extends BaseController

  @register loginModule
  @inject '$scope', '$http', 'User'

  login: ()=>
    @User.login(@$scope.username, @$scope.password)


  initialize: ()=>
    @$scope.username = ''
    @$scope.password = ''

