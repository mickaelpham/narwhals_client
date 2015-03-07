app = angular.module 'narwhal'

app.factory 'User', ['$http', ($http) ->
  new class User
    constructor: ->

    login: (username, password) ->
      console.log "Username: #{username}"
      console.log "Password: #{password}"
      request = $http.post 'https://nameless-scrubland-4785.herokuapp.com/v1/session/', {email: username, password: password }
      return request
]