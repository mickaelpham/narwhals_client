app = angular.module 'narwhal'

app.factory 'User', ['$http', ($http) ->
  new class User
    constructor: ->

    login: (username, password) ->
      request = $http.post 'https://nameless-scrubland-4785.herokuapp.com/v1/session/', {email: username, password: password }
      return request

    getTransactions: (sessionToken) ->
      request = $http.get 'https://nameless-scrubland-4785.herokuapp.com/v1/transactions', { params: { session_token: sessionToken }}
      return request
]