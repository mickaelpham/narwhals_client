loginModule = angular.module 'narwhal.login'

class LoginController extends BaseController

  @register loginModule
  @inject '$scope', '$http'


  login: ()->
    @$http.post 'http://heroku.com', { username: 'test', password: 'pass$word' }, ()->
      console.log "Success!"


  initialize: ()->

