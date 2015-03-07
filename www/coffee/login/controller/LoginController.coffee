loginModule = angular.module 'narwhal.login'

class LoginController extends BaseController

  @register loginModule
  @inject '$scope', '$http', '$state', 'User', '$rootScope', '$ionicViewSwitcher', 'locker'

  login: ()=>
    @$scope.isLoading = true
    @User.login(@$scope.username, @$scope.password).then( (result)=>
      @$scope.isLoading = false

      @$ionicViewSwitcher.nextDirection 'swap'
      @$rootScope.session_token = result.data.session_token

      @locker.put 'session_token', @$rootScope.session_token

      @$state.go 'index'
    )

  initialize: ()=>
    @$ionicViewSwitcher.nextDirection 'swap'
    console.log "initialized login module"

    if @locker.get('session_token')
      @$rootScope.session_token = @locker.get('session_token')

